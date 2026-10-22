import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma, ReadingStatus } from '@prisma/client';

@Injectable()
export class BookShelfService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.shelfBook.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async addBook(
    userId: string,
    input: {
      openLibraryId: string;
      title: string;
      authors?: string[];
      coverUrl?: string | null;
    },
  ) {
    const openLibraryId = input.openLibraryId.trim();
    const title = input.title.trim();

    if (!openLibraryId || !title) {
      throw new ConflictException('A book ID and title are required.');
    }

    try {
      return await this.prisma.shelfBook.create({
        data: {
          userId,
          openLibraryId,
          title,
          authors: input.authors ?? [],
          coverUrl: input.coverUrl ?? null,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('This book is already in your bookshelf.');
      }

      throw error;
    }
  }

  async updateBook(
    userId: string,
    id: string,
    input: {
      status?: ReadingStatus;
      rating?: number | null;
      notes?: string | null;
    },
  ) {
    if (
      input.status === undefined &&
      input.rating === undefined &&
      input.notes === undefined
    ) {
      throw new ConflictException('Provide at least one field to update.');
    }

    if (
      input.status !== undefined &&
      !Object.values(ReadingStatus).includes(input.status)
    ) {
      throw new ConflictException('Invalid reading status.');
    }

    if (
      input.rating !== undefined &&
      input.rating !== null &&
      (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5)
    ) {
      throw new ConflictException('Rating must be an integer from 1 to 5.');
    }

    const existing = await this.prisma.shelfBook.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Book not found in your bookshelf.');
    }

    return this.prisma.shelfBook.update({
      where: { id },
      data: input,
    });
  }

  async removeBook(userId: string, id: string) {
    const result = await this.prisma.shelfBook.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('Book not found in your bookshelf.');
    }

    return { message: 'Book removed from your bookshelf.' };
  }
}
