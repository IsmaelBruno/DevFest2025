// src/users/users.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage , Multer} from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() data: Partial<User>): Promise<User> {
    return this.usersService.create(data);
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // ✅ Nouvelle route pour upload avec données utilisateur
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('profile', {
      storage: diskStorage({
        destination: './uploads', // 📂 dossier où sera stockée l'image
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `profile-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Partial<User>,
  ): Promise<User> {
    if (file) {
      body.profileUrl = `/uploads/${file.filename}`;
    }
    return this.usersService.create(body);
  }
}
