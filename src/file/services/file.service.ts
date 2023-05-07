import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getFileCategory } from 'common';
import { FileType } from 'shared';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../auth/entities/user.entity';
import { GlobalConfig } from '../../common/configs/global.config';
import { FileResDto } from '../dtos/common/file.res.dto';
import { PresignUrlResDto } from '../dtos/common/presign-url.res.dto';
import { CreatePresignUrlUserReqDto } from '../dtos/user/req/file.user.req.dto';
import { FileRepository } from '../repositories/file.repository';

@Injectable()
export class FileService {
  private s3Client: S3;
  constructor(
    private configService: ConfigService<GlobalConfig>,
    private fileRepo: FileRepository,
  ) {
    console.log('first', configService.getOrThrow('aws.accessKey'));
    console.log('first2', configService.getOrThrow('aws.secretKet'));
    this.s3Client = new S3({
      credentials: {
        accessKeyId: configService.getOrThrow('aws.accessKey'),
        secretAccessKey: configService.getOrThrow('aws.secretKet'),
      },
      region: configService.getOrThrow('aws.region'),
    });
  }

  async createPresignUrl(dto: CreatePresignUrlUserReqDto, user: User) {
    const { fileType, audienceType } = dto;

    const key = this.genFileKey(fileType, user.id);
    const bucket = this.configService.getOrThrow('aws.bucket');

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
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
}
