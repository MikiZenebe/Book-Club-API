import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SessionAuthGuard } from '../auth/session-auth.guard.js';
import { BookShelfService } from './bookshelf.service.js';
import { ReadingStatus } from '@prisma/client';

interface AuthRequest extends Request {
  user: { sub: string };
}

@Controller('bookshelf')
@UseGuards(SessionAuthGuard)
export class BookShelfController {
  constructor(private readonly bookshelfService: BookShelfService) {}

  @Get()
  findAll(@Req() request: AuthRequest) {
    return this.bookshelfService.findAll(request.user.sub);
  }

  @Post()
  addBook(
    @Req() request: AuthRequest,
    @Body()
    body: {
      openLibraryId: string;
      title: string;
      authors: string[];
      coverUrl: string | null;
    },
  ) {
    if (
      typeof body.openLibraryId !== 'string' ||
      typeof body.title !== 'string' ||
      (body.authors !== undefined &&
        (!Array.isArray(body.authors) ||
          !body.authors.every((author) => typeof author === 'string'))) ||
      (body.coverUrl !== undefined &&
        body.coverUrl !== null &&
        typeof body.coverUrl !== 'string')
    ) {
      throw new BadRequestException('Invalid book details.');
    }

    return this.bookshelfService.addBook(
      request.user.sub,
      body as {
        openLibraryId: string;
        title: string;
        authors?: string[];
        coverUrl?: string | null;
      },
    );
  }

  @Patch(':id')
  updateBook(
    @Req() request: AuthRequest,
    @Param('id') id: string,
    @Body()
    body: {
      status?: ReadingStatus;
      rating?: number | null;
      notes?: string | null;
    },
  ) {
    if (
      body.status !== undefined &&
      !Object.values(ReadingStatus).includes(body.status)
    ) {
      throw new BadRequestException('Invalid reading status.');
    }

    if (
      body.rating !== undefined &&
      body.rating !== null &&
      (typeof body.rating !== 'number' ||
        !Number.isInteger(body.rating) ||
        body.rating < 1 ||
        body.rating > 5)
    ) {
      throw new BadRequestException('Rating must be between 1 and 5.');
    }

    if (
      body.notes !== undefined &&
      body.notes !== null &&
      typeof body.notes !== 'string'
    ) {
      throw new BadRequestException('Notes must be text.');
    }

    return this.bookshelfService.updateBook(request.user.sub, id, body);
  }

  @Delete(':id')
  removeBook(@Req() request: AuthRequest, @Param('id') id: string) {
    return this.bookshelfService.removeBook(request.user.sub, id);
  }
}
