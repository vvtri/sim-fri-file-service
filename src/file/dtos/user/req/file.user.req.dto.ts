import { AudienceType, FileType, IsValidEnum } from 'common';

export class CreatePresignUrlUserReqDto {
  @IsValidEnum({ enum: FileType, required: true })
  fileType: FileType;

  @IsValidEnum({ enum: AudienceType, required: true })
  audienceType: AudienceType;
}
