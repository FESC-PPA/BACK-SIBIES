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
  HttpException,
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
        message: ['Usuario creado con exito'],
        data: newUser,
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Usuario no existe', 
        },
        HttpStatus.NOT_FOUND, 
      );
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
        data: null,
        message: ['no se encontraron usuarios'],
      };
    } else {
      return {
        status: HttpStatus.OK,
        data: users.map((user) => new UserEntity(user)),
        message: ['Usuarios encontrados con exito'],
      };
    }
  }

  @ApiOkResponse({ type: UserEntity })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = new UserEntity(await this.usersService.findOne(id));
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        message: [`no se encontro el usuario con el id: ${id}`],
      };
    } else {
      return {
        status: HttpStatus.OK,
        data: user,
        message: [`Usuario encontrado con exito`],
      };
    }
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
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Usuario no existe', 
        },
        HttpStatus.NOT_FOUND, 
      );
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
        data: null,
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Usuario no existe', 
        },
        HttpStatus.NOT_FOUND, 
      );
    }
  }
}
