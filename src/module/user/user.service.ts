import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private user: Repository<User>,
    @Inject('bookQ') private bookQ: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, book_name } = createUserDto;
    const newUser = await this.user.create({ name, email });
    const user = await this.user.save(newUser);
    this.bookQ.emit('bookName', { id: user.user_id, book_name });
    return newUser;
  }

  async findOne(id: number) {
    return await this.user.find({ where: { user_id: id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates  #${id} usr`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
