import { Module } from '@nestjs/common';
import { AuthsService } from './services/auths.service';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy'; 
import { AuthsController } from './controllers/auths.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  controllers: [AuthsController],
  providers: [AuthsService, JwtStrategy],
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_CLAVE,
      signOptions: { expiresIn: '600s' },
    }),
    UsersModule,
  ],
})
export class AuthsModule {}
