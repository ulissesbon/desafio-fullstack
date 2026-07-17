import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { Plant } from './entities/plant.entity';
import { User } from './entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Plant)
    private plantRepository: Repository<Plant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(userData: any) {
    const { username, password } = userData;

    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new HttpException('Username already in use', HttpStatus.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({ username, passwordHash });
    await this.userRepository.save(newUser);

    return { message: 'User registered successfully!' };
  }

  async login(userData: any) {
    const { username, password } = userData;

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful!',
      access_token: token,
    };
  }

  async identifyPlant(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new HttpException('No image provided.', HttpStatus.BAD_REQUEST);
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
          headers: { ...formData.getHeaders() },
        }),
      );

      const topPrediction = response.data.predictions[0]; 

      // Salvamos a planta atrelada ao dono (userId)
      const newPlant = this.plantRepository.create({
        imageUrl: publicUrl,
        specie: topPrediction.specie,
        confidence: topPrediction.confidence,
        user: { id: userId } 
      });

      await this.plantRepository.save(newPlant);

      return {
        message: 'Plant identified and saved successfully!',
        data: newPlant,
      };
    } catch (error: any) {
      console.error('AI Communication Error:', error.message);
      throw new HttpException('Computer Vision service failed.', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getAllPlants(userId: string) {
    return this.plantRepository.find({
      where: { user: { id: userId } },
      order: { creationDate: 'DESC' },
    });
  }
}