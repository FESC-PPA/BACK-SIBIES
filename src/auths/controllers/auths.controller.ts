import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthsService } from '../services/auths.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from '../entities/auth.entity';
import { LoginDto } from '../dto/login.dto';
import { apiResponse } from 'src/utils/apiResponse';
import { Response } from 'express';

@Controller('auths')
@ApiTags('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(@Res() res: Response, @Body() { document, password }: LoginDto) {
    try {
      const { status, accessToken, message } = await this.authsService.login(document, password);
      res.status(status).json(apiResponse(
        status,
        { accessToken },
        [message]
      ));
    } catch (error) {
      res.status(error.status).json(apiResponse(
        error.status,
        error.message
      ));
    }
  }
}
