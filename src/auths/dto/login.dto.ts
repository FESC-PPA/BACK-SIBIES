import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  document: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  password: string;
}
