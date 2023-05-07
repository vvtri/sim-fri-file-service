import { IsValidEnum } from 'common';
import { AudienceType, FileType } from 'shared';

export class CreatePresignUrlUserReqDto {
  @IsValidEnum({ enum: FileType, required: true })
  fileType: FileType;

  @IsValidEnum({ enum: AudienceType, required: true })
  audienceType: AudienceType;
}
