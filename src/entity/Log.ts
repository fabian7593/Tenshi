// src/entity/Log.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("logs")
export class Log {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 200 })
  method: string;

  @Column({ type: "varchar", length: 200 })
  class: string;

  @Column({ type: "varchar", length: 40, nullable: true })
  type: string | null;

  @Column({ type: "int", nullable: true })
  https: number | null;

  @Column({ type: "varchar", length: 800 })
  message: string;

  @Column({ type: "varchar", length: 400, nullable: true })
  description: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;

  @Column({ type: "varchar", length: 200, nullable: true })
  user_id: string | null;

  @Column({ type: "varchar", length: 200, nullable: true })
  app_guid: string | null;

  @Column({ type: "varchar", length: 200, nullable: true })
  environment: string | null;
}
