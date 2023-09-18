import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

  constructor(private prismaservie: PrismaService){}

  create(createUserDto: CreateUserDto) {
    return this.prismaservie.user.create({ data: createUserDto });

  }

  findAll() {
    return this.prismaservie.user.findMany();
  }

  findOne(id: number) {
    return this.prismaservie.user.findUnique({ where: { id },
    include: {
      rol: true,
      gender: true
    } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaservie.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: number) {
    return this.prismaservie.user.delete({ where: { id } });
  }
}
