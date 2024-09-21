import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

export function validationPipeFactory() {
  return new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new BadRequestException(
        validationErrors.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints).join(', '),
        })),
        'Validation Error',
      );
    },
  });
}
