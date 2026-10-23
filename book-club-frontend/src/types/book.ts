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

export interface BookClub {
  id: string;
  name: string;
  description: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  ownerId: string;
  owner?: {
    id: string;
    name: string | null;
    picture: string | null;
  };
  _count?: {
    members: number;
    books: number;
  };
}

export interface ClubDiscussion {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    picture: string | null;
  };
}

export interface ClubBookItem {
  id: string;
  openLibraryId: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  createdAt: string;
  addedBy?: {
    id: string;
    name: string | null;
    picture: string | null;
  };
}
