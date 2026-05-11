import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService, MicrosoftProfile } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  @ApiOperation({ summary: 'Redirect to Microsoft login' })
  microsoftLogin() {
    // Handled by Passport
  }

  @Public()
  @Post('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Microsoft OAuth callback' })
  async microsoftCallback(
    @Req() req: Request & { user: MicrosoftProfile },
    @Res() res: Response,
  ) {
    const user = await this.authService.findOrCreateUser(req.user);
    const tokens = await this.authService.generateTokens(user);

    const adminUrl = process.env['ADMIN_URL'] ?? 'http://localhost:4201';
    const redirectUrl = new URL('/auth/callback', adminUrl);
    redirectUrl.searchParams.set('accessToken', tokens.accessToken);
    redirectUrl.searchParams.set('refreshToken', tokens.refreshToken);

    return res.redirect(redirectUrl.toString());
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  getMe(@CurrentUser() user: AuthUser) {
    return this.authService.getMe(user.id);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout (client should discard tokens)' })
  logout() {
    // JWT is stateless; client discards tokens. Add token blocklist here if needed.
    return;
  }
}
