import { Module } from '@nestjs/common';
import { AuthsService } from './services/auths.service';
import { UsersModule } from 'src/users/users.module';
import { AuthsController } from './controllers/auths.controller';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  controllers: [AuthsController],
  providers: [AuthsService],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_CLAVE,
      signOptions: { expiresIn: '600s' },
    }),
  ],
})
export class AuthsModule {}
