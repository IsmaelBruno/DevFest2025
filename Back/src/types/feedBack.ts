export interface Feedback {
    name: string;
    email: string;
    rating: number;
    message: string;
    gender?: 'male' | 'female' | 'other';
    status?: 'pending' | 'approved' | 'rejected';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface FeedbackStats {
    total: number;
    averageRating: number;
    satisfactionRate: number;
}