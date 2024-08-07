// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./Role";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "int", unsigned: true, nullable: true })
  card_id: number | null;

  @Column({ type: "varchar", length: 250 })
  first_name: string;

  @Column({ type: "varchar", length: 250 })
  last_name: string;

  @Column({ type: "varchar", length: 250, unique: true })
  email: string;

  @Column({ type: "varchar", length: 250, nullable: true, default: null })
  phone_number: string | null;

  @Column({ type: "varchar", length: 250 })
  password: string;

  @Column({ type: "enum", enum: ["M", "F", "O"], nullable: true })
  gender: "M" | "F" | "O" | null;

  @Column({ type: "datetime", nullable: true, default: null })
  birth_date: Date | null;

  @Column({ type: "varchar", length: 3, nullable: true, default: null })
  country_iso_code: string | null;

  @Column({ type: "varchar", length: 35 })
  role_code: string;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "tinyint", default: 0 })
  is_active: boolean;

  @Column({ type: "int", unsigned: true, default: 0 })
  fail_login_number: number;

  @Column({ type: "varchar", length: 400, nullable: true, default: null })
  forgot_password_token: string | null;

  @Column({ type: "varchar", length: 400, nullable: true, default: null })
  active_register_token: string | null;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true, default: null })
  latitude: number | null;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true, default: null })
  longitude: number | null;

  @Column({ type: "varchar", length: 10, default: "en" })
  language: string | null;

  @ManyToOne(() => Role, role => role.id)
  @JoinColumn({ name: "role_code", referencedColumnName: "code" })
  role: Role;
}
