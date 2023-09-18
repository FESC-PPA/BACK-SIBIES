import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthsModule } from './auths/auths.module';
import { ReportsModule } from './reports/reports.module';
import { HistorysModule } from './historys/historys.module';

@Module({
  imports: [ PrismaModule, UsersModule, AuthsModule, ReportsModule, HistorysModule],
})
export class AppModule {}
