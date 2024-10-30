// src/entity/UserNotification.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../tenshi/entity/User";
import { Notification } from "./Notification";

@Entity("user_notifications")
export class UserNotification {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar",nullable: true })
  id_user_send: number | string | null;

  @Column({ type: "varchar"})
  id_user_receive: number | string;

  @Column({ type: "varchar", length: 60 })
  notification_code: string;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  body_action: string;

  @Column({ type: "tinyint", default: 0 })
  is_read: boolean;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;

  @ManyToOne(() => Notification, notification => notification.id)
  @JoinColumn({ name: "notification_code", referencedColumnName: "code" })
  notification: Notification;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: "id_user_send", referencedColumnName: "id" })
  userSend: User;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: "id_user_receive", referencedColumnName: "id" })
  userReceive: User;
}
