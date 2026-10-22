export interface BookItem {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  firstPublishYear?: number | null;
  openLibraryUrl?: string;
  status?: "WANT_TO_READ" | "CURRENTLY_READING" | "FINISHED";
  rating?: number | null;
  notes?: string | null;
}
