import { Controller, Post, Body } from '@nestjs/common';
import { AuthsService } from '../services/auths.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from '../entities/auth.entity';
import { LoginDto } from '../dto/login.dto';

@Controller('auths')
@ApiTags('auths')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { document, password }: LoginDto) {
    return this.authsService.login(document, password);
  }
}
