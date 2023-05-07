import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';
import {
  AuthenticateUser,
  CurrentUser,
} from '../../common/decorators/auth.decorator';
import { CreatePresignUrlUserReqDto } from '../dtos/user/req/file.user.req.dto';
import { FileService } from '../services/file.service';

@Controller('file')
@AuthenticateUser()
export class FileController {
  constructor(private fileService: FileService) {}

  @Post()
  presignUrl(
    @Body() body: CreatePresignUrlUserReqDto,
    @CurrentUser() user: User,
  ) {
    return this.fileService.createPresignUrl(body, user);
  }
}
