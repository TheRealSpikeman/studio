// src/types/blog.ts
export interface BlogPost {
  id: string; // Firestore document ID
  slug: string; // URL-friendly slug
  title: string;
  excerpt: string;
  content: string; // Markdown content
  authorId: string;
  authorName: string; // Denormalized for easy display
  authorAvatarUrl?: string; // Optional
  featuredImageUrl: string;
  featuredImageHint: string; // Hint for AI image generation
  status: 'draft' | 'published';
  tags: string[];
  createdAt: string; // ISO date string
  publishedAt?: string; // ISO date string
}
