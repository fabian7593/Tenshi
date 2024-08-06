// src/entity/Notification.ts
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("notifications")
@Index("idx_code", ["code"])
export class Notification {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 60, unique: true })
  code: string;

  @Column({ type: "varchar", length: 30, default: "GENERAL" })
  type: string;

  @Column({ type: "varchar", length: 100 })
  subject: string;

  @Column({ type: "varchar", length: 250 })
  message: string;

  @Column({ type: "tinyint", default: 0 })
  required_send_email: boolean;

  @Column({ type: "tinyint", default: 1 })
  is_delete_after_read: boolean;

  @Column({ type: "varchar", length: 400, nullable: true, default: null })
  action_url: string | null;

  @Column({ type: "varchar", length: 10, default: "en" })
  language: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  app_guid: string | null;
}
