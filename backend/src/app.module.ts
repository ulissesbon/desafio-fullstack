import { join } from 'path';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from './entities/plants.entity';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [HttpModule,

    ServeStaticModule.forRoot({ 
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin123',
      database: 'plants_db',
      entities: [Plant],
      synchronize: true,
    }),

    TypeOrmModule.forFeature([Plant]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
