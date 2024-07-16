import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { CreateFollowInput } from './dto/create-follow.input';
import { User } from 'src/users/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async addFollow(createFollowInput: CreateFollowInput) {
    const { follower_id, following_id } = createFollowInput;
    const follower = await this.usersRepository.findOne({
      where: { id: follower_id },
    });
    const following = await this.usersRepository.findOne({
      where: { id: following_id },
    });

    if (!follower || !following) {
      throw new NotFoundException();
    }

    const newFollow = this.followsRepository.create({
      follower,
      following,
    });

    return {
      message: ` ${follower.name} follows ${following.name}`,
      data: this.followsRepository.save(newFollow),
      status: 'success',
    };
  }

  findAll() {
    return {
      message: 'data retrieved successfully',
      status: 'success',
      data: this.followsRepository.find({
        relations: ['follower', 'following'],
      }),
    };
  }

  findOne(id: number): Promise<Follow> {
    return this.followsRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const follow = await this.findOne(id);
    if (!follow) {
      throw new NotFoundException('user not found');
    }
    await this.followsRepository.remove(follow);
    return `follow of id ${id} is successfully deleted`;
  }
}
