import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel(createUserDto);
    await user.save();
    user.password = undefined;
    return { user }
  }

  async auth({ username, password }: AuthUserDto) {
    const user = await this.userModel.findOne( { username: username } );

    if (!user) {
      return {error: "Usuário não existe"};
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { 
      return { error: "Senha incorreta" }
    }

    user.password = undefined;

    return { user };
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(
      {
        _id: id
      },
      {
        $set: updateUserDto
      },
      {
        new: true
      }
    );
  }

  remove(id: string) {
    return this.userModel.deleteOne({
      _id: id
    }).exec();
  }
}
