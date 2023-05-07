import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'common';
import { FileController } from './controllers/file.controller';
import { FileRepository } from './repositories/file.repository';
import { FileService } from './services/file.service';

@Module({
  imports: [TypeOrmCustomModule.forFeature([FileRepository])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
