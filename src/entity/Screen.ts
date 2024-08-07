// src/entity/Screen.ts
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("screens")
@Index("idx_code", ["code"])
export class Screen {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  code: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  name: string;

  @Column({ type: "varchar", length: 400, nullable: true, default: null })
  description: string | null;
}
