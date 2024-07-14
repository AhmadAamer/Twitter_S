import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from './attachments.entity';
import { DeepPartial, Repository } from 'typeorm';
import { addAttachmentDto } from './dtos/add-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepo: Repository<Attachment>,
  ) {}
  async getAllAttachments() {
    return await this.attachmentRepo.find();
  }
  async addAttachment(addAttachmentDto: addAttachmentDto) {
    const newComment = await this.attachmentRepo.create(
      addAttachmentDto as DeepPartial<Attachment>,
    );
    return this.attachmentRepo.save(newComment);
  }
}
