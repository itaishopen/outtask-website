import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RoleName } from '@prisma/client';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  role: {
    findUnique: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};

const mockConfig = {
  get: jest.fn((key: string, def?: unknown) => {
    const values: Record<string, unknown> = {
      'auth.allowedDomains': ['outtask.nl'],
      'auth.jwtRefreshSecret': 'test-refresh-secret',
      'auth.jwtRefreshExpiresIn': '7d',
    };
    return values[key] ?? def;
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('findOrCreateUser', () => {
    it('throws ForbiddenException for unauthorized domain', async () => {
      await expect(
        service.findOrCreateUser({
          oid: '123',
          email: 'user@otherdomain.com',
          name: 'Test User',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('returns existing user when found by microsoftId', async () => {
      const mockUser = {
        id: 'user-1',
        microsoftId: 'oid-123',
        email: 'user@outtask.nl',
        name: 'Test User',
        isActive: true,
        role: { name: RoleName.ADMIN },
      };
      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

      const result = await service.findOrCreateUser({
        oid: 'oid-123',
        email: 'user@outtask.nl',
        name: 'Test User',
      });

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('creates new user with VIEWER role for first-time login', async () => {
      const mockRole = { id: 'role-viewer', name: RoleName.VIEWER };
      const mockNewUser = {
        id: 'user-new',
        microsoftId: 'new-oid',
        email: 'newuser@outtask.nl',
        name: 'New User',
        isActive: true,
        role: mockRole,
      };

      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null) // by microsoftId
        .mockResolvedValueOnce(null); // by email
      mockPrisma.role.findUnique.mockResolvedValueOnce(mockRole);
      mockPrisma.user.create.mockResolvedValueOnce(mockNewUser);

      const result = await service.findOrCreateUser({
        oid: 'new-oid',
        email: 'newuser@outtask.nl',
        name: 'New User',
      });

      expect(result).toEqual(mockNewUser);
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'newuser@outtask.nl',
            roleId: 'role-viewer',
          }),
        }),
      );
    });

    it('throws ForbiddenException for inactive user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        isActive: false,
        role: { name: RoleName.VIEWER },
      });

      await expect(
        service.findOrCreateUser({
          oid: 'oid-123',
          email: 'user@outtask.nl',
          name: 'Inactive User',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('generateTokens', () => {
    it('returns access and refresh tokens', async () => {
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.generateTokens({
        id: 'user-1',
        email: 'user@outtask.nl',
        name: 'Test User',
        role: { name: RoleName.ADMIN },
      });

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });
});
