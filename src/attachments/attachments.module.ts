import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsResolver } from './attachments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './attachments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment])],
  providers: [AttachmentsService, AttachmentsResolver],
})
export class AttachmentsModule {}
