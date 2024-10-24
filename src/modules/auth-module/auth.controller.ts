import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
  @Inject()
  private readonly userService: UserService;

  @Inject()
  private readonly authService: AuthService;

  @Post('registration')
  async registration(@Body() userRegistrationDto: UserRegistrationDto) {
    const user = await this.userService.registration(userRegistrationDto);
    return this.authService.login(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto, @Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refresh(body.refresh_token);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req?.user;
  }
}
