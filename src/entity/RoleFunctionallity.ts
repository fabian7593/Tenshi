import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './Role';
import { Screen } from './Screen';

@Entity({ name: 'role_functionallity' })
export class RoleFunctionallity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 35 })
  role_code: string;

  @Column({ type: 'enum', enum: ['C', 'R', 'U', 'D'] })
  func_type: 'C' | 'R' | 'U' | 'D';

  @Column({ type: 'varchar', length: 50 })
  function_code: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  screen_code: string;

  @Column({ type: 'varchar', length: 400, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  app_guid: string;
}
