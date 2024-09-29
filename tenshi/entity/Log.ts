// src/entity/Log.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("logs")
export class Log {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 200 })
  method: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  class: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  type: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  action: string | null;

  @Column({ type: "int", nullable: true })
  https: number | null;

  @Column({ type: "varchar", length: 1000 })
  message: string;

  @Column({ type: "varchar", length: 2500, nullable: true })
  data: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;

  @Column({ type: "varchar", length: 200, nullable: true })
  user_id: string | null;

  @Column({ type: "varchar", length: 200, nullable: true })
  ip_address: string | null;

  @Column({ type: "varchar", length: 200, nullable: true })
  environment: string | null;

  @Column({ type: "varchar", length: 200, nullable: true })
  platform: string | null;

  @Column({ type: "varchar", length: 1000, nullable: true })
  device_information: string | null;
}
