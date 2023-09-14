import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ReportsModule } from './reports/reports.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [, AuthModule, UserModule, ReportsModule, HistoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
