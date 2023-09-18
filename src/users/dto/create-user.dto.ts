import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  identicationCard: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ type: String })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  //@ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ enum: [1,2] })
  @IsNumber()
  @IsNotEmpty()
  rolId: number;

  @ApiProperty({ enum: [1,2,3,4,5] })
  @IsNumber()
  @IsNotEmpty()
  genderId: number;
}
