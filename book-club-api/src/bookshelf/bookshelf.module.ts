import { Module } from '@nestjs/common';
import { BookShelfController } from './bookshelf.controller.js';
import { BookShelfService } from './bookshelf.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [BookShelfController],
  providers: [BookShelfService],
})
export class BookshelfModule {}
