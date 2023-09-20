import { Module } from '@nestjs/common';
import { AuthsService } from './services/auths.service';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy'; 
import { AuthsController } from './controllers/auths.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { PrismaService } from 'src/prisma.service';

dotenv.config();

@Module({
  controllers: [AuthsController],
  providers: [AuthsService, JwtStrategy, PrismaService],
  imports: [
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
