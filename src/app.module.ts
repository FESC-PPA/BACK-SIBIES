import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { AuthsModule } from './auths/auths.module';
import { ReportsModule } from './reports/reports.module';
import { HistorysModule } from './historys/historys.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [  UsersModule, AuthsModule, ReportsModule, HistorysModule],
  providers: [PrismaService],
})
export class AppModule {}
