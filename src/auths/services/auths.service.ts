import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from '../entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';

@Injectable()
export class AuthsService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(document: string, password: string): Promise<AuthEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { identicationCard: document },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario no encontrado con el documento: ${document}`,
      );
    }

    if(user.rolId != 1){
      throw new UnauthorizedException(`No tiene permisos para acceder a este modulo`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('contraseña incorrecta');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
}
