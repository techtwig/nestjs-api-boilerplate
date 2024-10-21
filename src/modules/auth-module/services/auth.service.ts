import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (user && (await this.userService.comparePassword(pass, user.password))) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    if (user.hasOwnProperty('password')) {
      delete user['password'];
    }

    const payload = { username: user.email, sub: user.id, ...user };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newAccessToken = this.jwtService.sign({
        username: payload.username,
        sub: payload.sub,
      });
      const newRefreshToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub },
        { expiresIn: '7d' },
      );
      return { access_token: newAccessToken, refresh_token: refreshToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
