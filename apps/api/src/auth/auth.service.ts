import { Injectable, UnauthorizedException, ForbiddenException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RoleName } from '@prisma/client';

export interface MicrosoftProfile {
  oid: string;
  email: string;
  name: string;
  preferred_username?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async findOrCreateUser(profile: MicrosoftProfile) {
    const email = profile.email ?? profile.preferred_username ?? '';
    const allowedDomains = this.config.get<string[]>('auth.allowedDomains', ['outtask.nl']);

    const domain = email.split('@')[1];
    if (!allowedDomains.includes(domain)) {
      throw new ForbiddenException(
        `Email domain @${domain} is not authorized to access this system`,
      );
    }

    let user = await this.prisma.user.findUnique({
      where: { microsoftId: profile.oid },
      include: { role: true },
    });

    if (!user) {
      // Check if user exists by email (first login case)
      user = await this.prisma.user.findUnique({
        where: { email },
        include: { role: true },
      });

      if (user) {
        // Update microsoftId on first SSO login
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { microsoftId: profile.oid, name: profile.name },
          include: { role: true },
        });
      } else {
        // New user — assign VIEWER role by default
        const viewerRole = await this.prisma.role.findUnique({ where: { name: RoleName.VIEWER } });
        if (!viewerRole) throw new Error('VIEWER role not seeded in database');

        user = await this.prisma.user.create({
          data: {
            microsoftId: profile.oid,
            email,
            name: profile.name,
            roleId: viewerRole.id,
          },
          include: { role: true },
        });

        this.logger.log(`New user created: ${email} with VIEWER role`);
      }
    }

    if (!user.isActive) {
      throw new ForbiddenException('Your account has been deactivated');
    }

    return user;
  }

  async generateTokens(user: { id: string; email: string; name: string; role: { name: string } }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('auth.jwtRefreshSecret'),
        expiresIn: this.config.get<string>('auth.jwtRefreshExpiresIn', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.get<string>('auth.jwtRefreshSecret'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { role: true },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        role: { select: { name: true } },
      },
    });

    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
