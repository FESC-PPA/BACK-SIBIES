import { ApiProperty } from '@nestjs/swagger';
import { User} from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
      }



    @ApiProperty()
    id: number;

    @ApiProperty()
    identicationCard: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @Exclude()
    password: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    rolId: number;

    @ApiProperty()
    genderId: number;

  
}
