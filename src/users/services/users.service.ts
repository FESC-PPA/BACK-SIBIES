import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const roundsOfHashing = parseInt(process.env.ROUNDS_OF_HASHING);

@Injectable()
export class UsersService {
  constructor(private prismaservice: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hashSync(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    return this.prismaservice.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prismaservice.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prismaservice.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario con el id: ${id} no existe`,
      );
    }

    return this.prismaservice.user.findUnique({
      where: { id },
      include: {
        rol: true,
        gender: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prismaservice.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario con el id: ${id} no existe`,
      );
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }
    return this.prismaservice.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.prismaservice.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario con el id: ${id} no existe`,
      );
    }

    return this.prismaservice.user.delete({ where: { id } });
  }
}
