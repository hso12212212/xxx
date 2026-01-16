export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  instagram?: string;
  createdAt: Date;
  role: 'user' | 'admin';
  isVerified: boolean;
  verifiedAt?: Date;
  isBanned: boolean;
  bannedAt?: Date;
  bannedReason?: string;
}

export interface Article {
  id: string;
  title: string;
  imageURL: string;
  content: string;
  tags: string[];
  authorId: string;
  authorName?: string;
  authorAvatar?: string;
  authorVerified?: boolean;
  authorInstagram?: string;
  createdAt: Date;
  likesCount: number;
  commentsCount?: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectedReason?: string;
  approvedAt?: Date;
  approvedBy?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  comment: string;
  createdAt: Date;
}

export interface Like {
  id: string;
  articleId: string;
  userId: string;
}
