import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('plants')
export class Plant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @Column()
  specie: string;

  @Column('float')
  confidence: number;

  @CreateDateColumn()
  creationDate: Date;

  @ManyToOne(() => User, (user) => user.plants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}