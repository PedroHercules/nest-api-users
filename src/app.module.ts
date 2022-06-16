import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot(),

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE), 
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
