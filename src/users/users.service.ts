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

  async create({ username, email, password }: CreateUserDto) {
    if ( !username || !email || !password ) {
      return { status: 400, error: "É necessário ter todos os dados de requisição" }
    }

    const userExists = await this.userModel.findOne( 
      { 
        $or: [ 
          {username: username},
          {email: email} 
        ]
      });

    if (userExists.username === username){
      return { status: 400, error: "Este nome de usuário já existe" }
    }
    if (userExists.email === email){
      return { status: 400, error: "Este e-mail já existe" }
    }  

    password = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, email, password });
    await user.save();
    user.password = undefined;
    return { status: 201, user }
  }

  async auth({ username, password }: AuthUserDto) {
    const user = await this.userModel.findOne( { username: username } );

    if (!user) {
      return {status: 404, error: "Usuário não existe"};
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { 
      return { status: 400, error: "Senha incorreta" }
    }
    user.password = undefined;

    return { status: 200, user };
  }

  async findAll() {
    const users = await this.userModel.find().select('-password');
    if (!users){
      return { status: 404, error: 'Não há usuários no banco de dados' }
    }

    return { status: 200, users }
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password');

    if(!user){
      return { status: 404, error: "Usuário não existe" }
    }

    return { status: 200, user };
  }

  async update(id: string, { username, email }: UpdateUserDto) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      return { status: 404, error: 'Usuário não existe' }
    }

    if (username){
      user.username = username;
    }
    if (email){
      user.email = email;
    }

    await user.save();

    return { status: 201, user }
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user){
      return { status: 404, error: "Usuário não existe" }
    }
    const userDeleted = await this.userModel.deleteOne({
      _id: id
    }).exec();

    if (userDeleted.deletedCount === 0){
      return { status: 400, error: "Usuário não foi deletado" }
    }

    return { status: 200, user }
  }
}
