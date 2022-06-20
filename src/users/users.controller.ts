import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const response = await this.usersService.create(createUserDto);
    return res.status(response.status).json({ response });
  }

  @Post('auth')
  async auth(@Body() authUserDto: AuthUserDto, @Res() res: Response){
    const response = await this.usersService.auth(authUserDto)
    return res.status(response.status).json({ response });
  }
  

  @Get()
  async findAll(@Res() res: Response) {
    const response = await this.usersService.findAll();
    return res.status(response.status).json({ response });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const response = await this.usersService.findOne(id);
    return res.status(response.status).json({ response });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    const response = await this.usersService.update(id, updateUserDto);
    return res.status(response.status).json({ response });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
