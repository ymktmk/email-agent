import type { UserRepository } from '../../domain/entities/UserRepository';

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute() {
    return this.userRepository.findAll();
  }
}
