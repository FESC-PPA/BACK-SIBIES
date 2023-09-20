import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class AuthEntity {
  @ApiProperty()
  accessToken: string;
  status: HttpStatus;
  message: string;
}
