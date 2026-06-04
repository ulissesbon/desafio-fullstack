import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';

@Controller('plants')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('identify')
  @UseInterceptors(FileInterceptor('file'))
  async identifyPlant(@UploadedFile() file: Express.Multer.File) {
    return this.appService.identifyPlant(file);
  }

  @Get()
  async getAllPlants() {
    return this.appService.getAllPlants();
  }
}
