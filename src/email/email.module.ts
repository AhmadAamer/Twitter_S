import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailResolver } from './email.resolver';

@Module({
  exports: [EmailModule],
  providers: [EmailService, EmailResolver],
})
export class EmailModule {}
