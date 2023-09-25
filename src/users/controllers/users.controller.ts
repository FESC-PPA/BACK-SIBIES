import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
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
import { apiResponse } from 'src/utils/apiResponse';
import { Response } from 'express';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const newUser = new UserEntity(
      await this.usersService.create(createUserDto),
    );

    if (newUser) {
      const { password, ...userWithoutPassword } = newUser;

      res
        .status(HttpStatus.CREATED)
        .json(
          apiResponse(
            HttpStatus.CREATED,
            { userWithoutPassword },
            'Usuario creado con exito',
          ),
        );
    } else {
      res
        .status(HttpStatus.NOT_FOUND)
        .json(
          apiResponse(HttpStatus.CREATED, { newUser }, 'Usuario no existe'),
        );
    }
  }

  @ApiOkResponse({ type: UserEntity, isArray: true })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Res() res: Response): Promise<void> {
    try {
      const users = await this.usersService.findAll();

      if (users.length > 0) {
        const usersWithoutPassword = users.map((user) => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });

        res
          .status(HttpStatus.OK)
          .json(
            apiResponse(
              HttpStatus.OK,
              usersWithoutPassword,
              'Lista de usuarios obtenida con éxito',
            ),
          );
      } else {
        res
          .status(HttpStatus.NOT_FOUND)
          .json(
            apiResponse(
              HttpStatus.NOT_FOUND,
              null,
              'No se encontraron usuarios',
            ),
          );
      }
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          apiResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            null,
            'Error al obtener la lista de usuarios',
          ),
        );
    }
  }

  @ApiOkResponse({ type: UserEntity })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const user = new UserEntity(await this.usersService.findOne(id));
    if (!user) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json(
          apiResponse(
            HttpStatus.NOT_FOUND,
            `no se encontro el usuario con el id: ${id}`,
          ),
        );
    } else {
      const { password, ...userWithoutPassword } = user;

      res
        .status(HttpStatus.OK)
        .json(
          apiResponse(
            HttpStatus.OK,
            userWithoutPassword,
            'Usuario encontrado con exito',
          ),
        );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userFound = new UserEntity(
      await this.usersService.update(id, updateUserDto),
    );

    if (userFound) {
      const { password, ...userWithoutPassword } = userFound;

      res
        .status(HttpStatus.OK)
        .json(
          apiResponse(HttpStatus.OK, userWithoutPassword, 'Cambios Realizados'),
        );
    } else {
      res
        .status(HttpStatus.NOT_FOUND)
        .json(
          apiResponse(
            HttpStatus.NOT_FOUND,
            `no se encontro el usuario con el id: ${id}`,
          ),
        );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const userFound = new UserEntity(await this.usersService.remove(id));

    if (userFound) {
      res
        .status(HttpStatus.OK)
        .json(apiResponse(HttpStatus.OK, null, 'Eliminado con exito'));
    } else {
      res
        .status(HttpStatus.NOT_FOUND)
        .json(
          apiResponse(
            HttpStatus.NOT_FOUND,
            `no se encontro el usuario con el id: ${id}`,
          ),
        );
    }
  }
}
