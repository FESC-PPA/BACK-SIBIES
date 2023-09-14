import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ReportsModule } from './reports/reports.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [AuthModule, UserModule, ReportsModule, HistoryModule],
})
export class AppModule {}
