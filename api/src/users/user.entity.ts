import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 100 })
  nom: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 30, default: 'Admin' })
  role: string;

  @Column({ type: 'boolean', default: true })
  actif: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
