import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const roundsOfHashing = parseInt(process.env.ROUNDS_OF_HASHING);

@Injectable()
export class UsersService {
  constructor(private prismaservie: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    return this.prismaservie.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prismaservie.user.findMany();
  }

  findOne(id: number) {
    return this.prismaservie.user.findUnique({
      where: { id },
      include: {
        rol: true,
        gender: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }
    return this.prismaservie.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prismaservie.user.delete({ where: { id } });
  }
}
