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

    
    if (!this.checkUser(id)) {
      throw new HttpException(
        {
          message: 'Usuario no existe',
          data: null,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    

    return this.prismaservice.user.findFirst({
      where: { identicationCard: id },
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
      throw new HttpException(
        {
          message: 'Usuario no existe',
          data: null,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

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
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.prismaservice.user.findUnique({
      where: { id },
    });

    if(user.id === id){
      throw new HttpException(
        {
          message: 'No puedes eliminarte a ti mismo',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

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

    return this.prismaservice.user.delete({ where: { id } });
  }

  async checkUser(id:string){
    
    return await this.prismaservice.user.findFirst({where:{identicationCard: id}});
  }
}
