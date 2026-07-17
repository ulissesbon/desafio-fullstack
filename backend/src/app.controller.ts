import { Controller, Post, Get, Body, UploadedFile, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('auth/register')
  async register(@Body() body: any) {
    return this.appService.register(body);
  }

  @Post('auth/login')
  async login(@Body() body: any) {
    return this.appService.login(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('plants/identify')
  @UseInterceptors(FileInterceptor('file'))
  async identifyPlant(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const userId = req.user.userId;
    return this.appService.identifyPlant(file, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('plants')
  async getAllPlants(@Req() req: any) {
    const userId = req.user.userId;
    return this.appService.getAllPlants(userId);
  }
}