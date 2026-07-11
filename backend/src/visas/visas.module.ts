import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visa } from '../entities/visa.entity';
import { VisasController } from './visas.controller';
import { VisasService } from './visas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Visa]),
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: 60000, limit: 5 }],
    }),
  ],
  controllers: [VisasController],
  providers: [VisasService],
})
export class VisasModule {}
