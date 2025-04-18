// src/entity/UserNotification.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../tenshi/entity/User";
import { Notification } from "./Notification";

@Entity("user_notifications")
export class UserNotification {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;
  
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "user_send", referencedColumnName: "id" })
  user_send: User | null;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "user_receive", referencedColumnName: "id" })
  user_receive: User;

  @ManyToOne(() => Notification)
  @JoinColumn({ name: "notification", referencedColumnName: "code" })
  notification: Notification;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  body_action: string;

  @Column({ type: "tinyint", default: 0 })
  is_read: boolean;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;
}
