import { Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from '@vvtri/nestjs-kafka';
import { AllExceptionsFilter } from 'common';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { dataSource } from '../data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import globalConfig from './common/configs/global.config';
import { consumerConfig, kafkaConfig } from './common/configs/kafka.config';
import { FileModule } from './file/file.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => globalConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({} as any),
      dataSourceFactory: async () => {
        initializeTransactionalContext();
        return addTransactionalDataSource(dataSource);
      },
    }),
    KafkaModule.forRoot({ kafkaConfig, consumerConfig }),
    AuthModule,
    UtilModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_PIPE, useValue: new ValidationPipe() },
  ],
})
export class AppModule {}
