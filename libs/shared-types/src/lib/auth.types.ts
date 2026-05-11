import { RoleName } from './enums';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  isActive: boolean;
  createdAt: string;
  role: { name: RoleName };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
