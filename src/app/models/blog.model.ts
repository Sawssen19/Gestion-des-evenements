export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  likes: number;
  views: number;
  isLiked: boolean;
  isFavorite: boolean;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}
