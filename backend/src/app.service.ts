import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Plant } from './entities/plants.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService,
    @InjectRepository(Plant)
    private plantRepository: Repository<Plant>,
  ) {}

  async identifyPlant(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Nenhuma imagem enviada', HttpStatus.BAD_REQUEST);
    }

    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, uniqueName);

    fs.writeFileSync(filePath, file.buffer);

    const publicUrl = `http://localhost:3000/uploads/${uniqueName}`;

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    try {
      const response = await lastValueFrom(
        this.httpService.post('http://localhost:8000/identify', formData, {
          headers: {
            ...formData.getHeaders(),
          },
        }),
      );

      const topPrediction = response.data.predictions[0];

      const newPlant = this.plantRepository.create({
        imageUrl: publicUrl,
        specie: topPrediction.specie,
        confidence: topPrediction.confidence,
      });

      await this.plantRepository.save(newPlant);

      return {
        message: 'Planta identificada com sucesso!',
        data: newPlant,
      };

    } catch (erro) {
      console.error('Erro ao comunicar com serviço', erro.message);
      throw new HttpException('Falha no serviço de IA', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
   async getAllPlants() {
    return this.plantRepository.find({
      order: { creationDate: 'DESC'},
    });
   }
}
