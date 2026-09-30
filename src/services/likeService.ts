import { LikeRepository } from '../repositories/likeRepository.ts';

export class LikeService {
  private likeRepository: LikeRepository;

  constructor(
    likeRepository: LikeRepository = new LikeRepository(),
  ) {
    this.likeRepository = likeRepository;
  }

  async createLike(input: {
    reviewId: number;
    userId: number;
  }) {
    return this.likeRepository.create(input);
  }

  async deleteLike(id: number) {
    await this.likeRepository.delete(id);
    return { id };
  }
}