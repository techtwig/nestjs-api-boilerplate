import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';

@ValidatorConstraint({ name: 'uniqueEmail', async: true })
@Injectable()
export class UniqueEmailValidation implements ValidatorConstraintInterface {
  @Inject()
  private readonly userService: UserService;

  async validate(value: string): Promise<boolean> {
    return !(await this.userService.findOneByEmail(value));
  }

  defaultMessage() {
    return `Email already exist`;
  }
}

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueEmailValidation,
    });
  };
}
