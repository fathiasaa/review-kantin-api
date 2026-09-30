import { ReviewRepository } from '../repositories/reviewRepository.ts';

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor(
    reviewRepository: ReviewRepository = new ReviewRepository(),
  ) {
    this.reviewRepository = reviewRepository;
  }

  async getReviews() {
    return this.reviewRepository.findAll();
  }

  async createReview(input: {
    stallId: number;
    userId: number;
    rating: number;
    comment: string;
  }) {
    return this.reviewRepository.create(input);
  }

  async deleteReview(id: number) {
    await this.reviewRepository.delete(id);
    return { id };
  }
}