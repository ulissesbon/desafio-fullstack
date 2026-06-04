import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('plants')
export class Plant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    imageUrl: string;

    @Column()
    specie: string

    @Column('float')
    confidence: number;

    @CreateDateColumn()
    creationDate: Date;
}