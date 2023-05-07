import { NonFunctionProperties } from 'common';
import { FileResDto } from './file.res.dto';

export class PresignUrlResDto {
  file: FileResDto;
  presignedUrl: string;

  constructor(data: NonFunctionProperties<PresignUrlResDto>) {
    Object.assign(this, data);
  }
}
