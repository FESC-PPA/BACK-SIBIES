import {
  HttpStatus,
  Injectable,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const roundsOfHashing = parseInt(process.env.ROUNDS_OF_HASHING);

@Injectable()
export class UsersService {
  constructor(private prismaservice: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prismaservice.user.findFirst({
      where: {
        OR: [
          {
            identicationCard: createUserDto.identicationCard,
          },
        ],
      },
    });

    if (existingUser) {
      throw new HttpException(
        {
          message: 'Usuario existente',
          data: null,
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hashSync(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    return this.prismaservice.user.create({ data: createUserDto });
  }

  async findAll() {
    const users = await this.prismaservice.user.findMany();

    return users;
  }

  async findOne(id: string) {

    return this.prismaservice.user.findFirst({
      where: { identicationCard: id },
      include: {
        rol: true,
        gender: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.checkUser(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    if (updateUserDto.rolId) {
      throw new HttpException(
        {
          message: 'No se puede actualizar el rol',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.prismaservice.user.update({
      where: { identicationCard: id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    const user = await this.checkUser(id);

    return this.prismaservice.user.delete({ where: { identicationCard: id } });
  }

  //funcion para comprobar si un usuario existe
  async checkUser(id: string) {
    const user = await this.prismaservice.user.findFirst({
      where: { identicationCard: id },
    });

    if (!user) {
      throw new HttpException(
        {
          message: 'Usuario no existe',
          data: null,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

   return user; 
  }

  async getUserByID(id: number){
    return this.prismaservice.user.findFirst({
      where:{id},
      include: {
        rol: true,
        gender: true,
      }

    })
  }
}
