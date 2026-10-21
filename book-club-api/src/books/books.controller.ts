import { Controller, Get, Query } from '@nestjs/common';
import { BooksService } from './books.service.js';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get('search')
  searchBooks(@Query('q') query: string) {
    return this.bookService.searchBooks(query);
  }
}
