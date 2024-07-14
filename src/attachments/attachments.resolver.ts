import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AttachmentsService } from './attachments.service';
import { Attachment } from './attachments.entity';
import { addAttachmentInput } from './inputs/add-attachment.input';

@Resolver()
export class AttachmentsResolver {
  constructor(private attachmentsService: AttachmentsService) {}
  @Mutation(() => Attachment)
  addAttachment(
    @Args('addAttachmentInput') addAttachmentInput: addAttachmentInput,
  ) {
    return this.attachmentsService.addAttachment(addAttachmentInput);
  }
}
