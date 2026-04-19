import type { UserType } from 'src/auth/types';

export interface IReviewItem {
  _id: string;
  user: Partial<UserType>;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  verifiedPurchase: boolean;
}
