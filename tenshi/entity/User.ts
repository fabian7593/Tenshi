// src/entity/User.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", unsigned: true, nullable: true })
  card_id: number | null;

  @Column({ type: "varchar", length: 250 })
  first_name: string;

  @Column({ type: "varchar", length: 250 })
  last_name: string;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  bio: string;

  @Column({ type: "varchar", length: 250, unique: true })
  email: string;

  @Column({ type: "varchar", length: 250, unique: true, nullable: true, default: null })
  user_name: string;

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

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  city_name: string | null;

  @Column({ type: "varchar", length: 50, nullable: true, default: null })
  postal_code: string | null;

  @Column({ type: "varchar", length: 35 })
  role_code: string;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "tinyint", default: 0 })
  is_active_from_email: boolean;

  @Column({ type: "enum", enum: ["active", "pending", "suspended", "closed"], default: "pending" })
  account_status: "active" | "pending" | "suspended" | "closed";

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

  @Column({ type: "varchar", length: 10, nullable: true, default: "en" })
  language: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  profile_picture_url: string | null;

  @Column({ type: "datetime", nullable: true, default: null })
  last_login_at: Date | null;

  @Column({ type: "varchar", length: 45, nullable: true, default: null })
  login_ip_address: string | null;

  @Column({ type: "tinyint", default: 0 })
  two_factor_enabled: boolean;

  @Column({ type: "enum", enum: ["SMS", "EMAIL", "TOTP", null], nullable: true, default: null })
  two_factor_type: "SMS" | "EMAIL" | "TOTP" | null;

  @Column({ type: "varchar", length: 250, nullable: true, default: null })
  two_factor_secret: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @Column({ type: "datetime", nullable: true, default: null })
  verified_at: Date | null;
}
