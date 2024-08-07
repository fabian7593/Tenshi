// src/entity/Role.ts
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("roles")
@Index("idx_code", ["code"])
export class Role {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 35, unique: true })
  code: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  name: string;

  @Column({ type: "varchar", length: 400, nullable: true, default: null })
  description: string | null;
}
