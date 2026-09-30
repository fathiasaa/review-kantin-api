import { UserRepository } from '../repositories/userRepository.ts';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async getUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    return user;
  }

  async createUser(input: {
    name: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'owner' | 'customer';
  }) {
    return this.userRepository.create(input);
  }
}