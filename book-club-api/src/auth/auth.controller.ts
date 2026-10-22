import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { response, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleSignIn(
    @Body() body: { idToken?: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    if (typeof body.idToken !== 'string' || !body.idToken.trim()) {
      throw new BadRequestException('Google ID token is required.');
    }

    const result = await this.authService.signInWithGoogle(body.idToken);

    response.cookie('booknest_session', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      user: result.user,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('bookheaven_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
