import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { JwtAuthGuard } from 'src/auths/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = new UserEntity(
      await this.usersService.create(createUserDto),
    );

    if (newUser) {
      return {
        status: HttpStatus.CREATED,
        message: 'Usuario Creado con exito',
        data: newUser,
      };
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'No se pudo crear el usuario',
      };
    }
  }

  @ApiOkResponse({ type: UserEntity, isArray: true })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    if (!users) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'No se encontraron usuarios',
      };
    }

    return users.map((user) => new UserEntity(user));
  }

  @ApiOkResponse({ type: UserEntity })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `no se encontro el usuario con el id: ${id}`,
      };
    }

    return user;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userFound = new UserEntity(
      await this.usersService.update(id, updateUserDto),
    );

    if (userFound) {
      return {
        status: HttpStatus.OK,
        message: `cambios realizados`,
        data: userFound,
      };
    } else {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Usuario no encontrado con el id: ${id}`,
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const userFound = new UserEntity(await this.usersService.remove(id));

    if (userFound) {
      return {
        status: HttpStatus.OK,
        message: `Eliminacion Correcta`,
        data: userFound,
      };
    } else {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Usuario no encontrado con el id: ${id}`,
      };
    }
  }
}
