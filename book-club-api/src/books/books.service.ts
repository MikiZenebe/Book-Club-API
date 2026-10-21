import {
  Injectable,
  BadGatewayException,
  BadRequestException,
} from '@nestjs/common';

export interface Book {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  firstPublishYear: number | null;
  openLibraryUrl: string;
}

@Injectable()
export class BooksService {
  async searchBooks(query: string): Promise<Book[]> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      throw new BadRequestException('Please enter a book title or author.');
    }

    const url = new URL('https://openlibrary.org/search.json');

    url.searchParams.set('q', trimmedQuery);
    url.searchParams.set(
      'fields',
      'key,title,author_name,cover_i,first_publish_year',
    );
    url.searchParams.set('limit', '20');

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'BookNest/1.0 (local development)',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        throw new Error('Open Library request failed.');
      }

      const data = await res.json();

      return (data.docs ?? []).map((item: any) => ({
        id: item.key,
        title: item.title,
        authors: item.author_name ?? [],
        coverUrl: item.cover_i
          ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
          : null,
        firstPublishYear: item.first_publish_year ?? null,
        openLibraryUrl: `https://openlibrary.org${item.key}`,
      }));
    } catch (error) {
      throw new BadGatewayException(
        'The book catalog is temporarily unavailable. Please try again.',
      );
    }
  }
}
