import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRegistrationDto } from '../dto/user-registration.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async findOneByEmail(email: string, raw = true) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async createUser(data: any) {
    const userData = this.userRepository.create(data);
    return this.userRepository.save(userData);
  }

  async onApplicationBootstrap() {
    const adminEmail = 'admin@gmail.com';

    const adminExists = await this.findOneByEmail(adminEmail);

    if (!adminExists) {
      const adminPassword = await this.hashPassword('password', 10);

      await this.createUser({
        full_name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        row_status: 1,
      });

      console.log('Admin user created successfully...');
    }
  }

  async registration(userRegistrationDto: UserRegistrationDto) {
    userRegistrationDto.password = await this.hashPassword(
      userRegistrationDto.password,
      10,
    );
    return await this.createUser(userRegistrationDto);
  }

  /**
   * @deprecated TODO: move to helpers file
   */
  async hashPassword(password: string, saltRounds): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  }

  /**
   * @deprecated TODO: move to helpers file
   */
  async comparePassword(
    password: string,
    actualPassword: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, actualPassword, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  }
}
