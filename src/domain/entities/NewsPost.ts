export interface NewsPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string; // ISO string from API
  status: 'published' | 'draft' | 'archived';
  category: string;
  image: string;
  excerpt: string;
  isPinned: boolean;
}

// Payload for creating a news post
export type CreateNewsInput = {
  title: string;
  content: string;
  author: string;
  publishDate?: string; // optional; server can set default
  status?: 'published' | 'draft' | 'archived';
  category?: string;
  image?: string;
  excerpt?: string;
  isPinned?: boolean;
};
