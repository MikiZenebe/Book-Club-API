import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleSignIn(@Body() body: { idToken?: string }) {
    if (typeof body.idToken !== 'string' || !body.idToken.trim()) {
      throw new UnauthorizedException('Google ID token is required.');
    }

    const user = await this.authService.verifyGoogleToken(body.idToken);

    return {
      message: 'Google identity verified.',
      user,
    };
  }
}
