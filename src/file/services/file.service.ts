import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaProducer } from '@vvtri/nestjs-kafka';
import {
  FileCreatedKafkaPayload,
  FileUpdatedKafkaPayload,
  KAFKA_TOPIC,
  getFileCategory,
} from 'common';
import { FileType } from 'shared';
import { Transactional } from 'typeorm-transactional';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../auth/entities/user.entity';
import { GlobalConfig } from '../../common/configs/global.config';
import { FileResDto } from '../dtos/common/file.res.dto';
import { PresignUrlResDto } from '../dtos/common/presign-url.res.dto';
import { CreatePresignUrlUserReqDto } from '../dtos/user/req/file.user.req.dto';
import { File } from '../entities/file.entity';
import { FileRepository } from '../repositories/file.repository';

@Injectable()
export class FileService {
  private s3Client: S3;
  constructor(
    private configService: ConfigService<GlobalConfig>,
    private fileRepo: FileRepository,
    private kafkaProducer: KafkaProducer,
  ) {
    this.s3Client = new S3({
      credentials: {
        accessKeyId: configService.getOrThrow('aws.accessKey'),
        secretAccessKey: configService.getOrThrow('aws.secretKet'),
      },
      region: configService.getOrThrow('aws.region'),
    });
  }

  @Transactional()
  async createPresignUrl(dto: CreatePresignUrlUserReqDto, user: User) {
    const { fileType, audienceType } = dto;

    const key = this.genFileKey(fileType, user.id);
    const bucket = this.configService.getOrThrow('aws.bucket');

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });

    const file = this.fileRepo.create({
      key,
      bucket,
      audienceType: audienceType,
      fileType,
      userId: user.id,
    });
    await this.fileRepo.save(file);

    await this.sendFileCreatedKafka(file);

    return new PresignUrlResDto({
      file: FileResDto.forUser({ data: file }),
      presignedUrl,
    });
  }

  private genFileKey(fileType: FileType, userId: number, fileName?: string) {
    const randomStr = uuidv4();
    const fileCategory = getFileCategory(fileType);

    if (fileName) {
      return `${fileCategory}/${userId}/${randomStr}/${fileName}.${fileType}`;
    }

    return `${fileCategory}/${userId}/${randomStr}.${fileType}`;
  }

  private async sendFileCreatedKafka(file: File) {
    const kafkaPayload = new FileCreatedKafkaPayload(file);
    await this.kafkaProducer.send<FileCreatedKafkaPayload>({
      topic: KAFKA_TOPIC.FILE_CREATED,
      messages: [{ value: kafkaPayload, headers: { id: String(file.id) } }],
      acks: -1,
    });
  }

  private async sendFileUpdatedKafka(file: File) {
    const kafkaPayload = new FileUpdatedKafkaPayload(file);
    await this.kafkaProducer.send<FileUpdatedKafkaPayload>({
      topic: KAFKA_TOPIC.FILE_UPDATED,
      messages: [{ value: kafkaPayload, headers: { id: String(file.id) } }],
    });
  }
}
