// transform.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class TransformPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    // Check if value is a class instance, if not, return it as is
    if (!metadata.metatype || !this.toDto(metadata.metatype)) {
      return value;
    }

    // Transform to DTO
    const dtoClass = this.toDto(metadata.metatype);
    const object = plainToInstance(dtoClass, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return object;
  }

  // Map models to corresponding DTOs
  private toDto(metatype: any): any {
    const map = new Map([
      [UserModel, UserDto],
      // Add mappings for other models here
    ]);
    return map.get(metatype);
  }
}
