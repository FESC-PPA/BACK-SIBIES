import { Module } from '@nestjs/common';
import { HistorysService } from './services/historys.service';
import { HistorysController } from './controllers/historys.controller';

@Module({
  controllers: [HistorysController],
  providers: [HistorysService],
})
export class HistorysModule {}
