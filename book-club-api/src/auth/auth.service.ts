import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client();

  async verifyGoogleToken(idToken: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      throw new InternalServerErrorException(
        'Google authentication is not configured.',
      );
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: clientId,
      });

      const payload = ticket.getPayload();

      if (!payload?.sub || !payload.email) {
        throw new UnauthorizedException(
          'Google account information is incomplete.',
        );
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name ?? '',
        picture: payload.picture ?? null,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired Google ID token.');
    }
  }
}
