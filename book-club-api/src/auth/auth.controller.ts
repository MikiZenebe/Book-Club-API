import {
  BadRequestException,
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
  async googleSignIn(@Body() body: { idToken?: string }) {
    if (typeof body.idToken !== 'string' || body.idToken.trim().length === 0) {
      throw new BadRequestException('Google ID token is required.');
    }

    return this.authService.signInWithGoogle(body.idToken);
  }
}
