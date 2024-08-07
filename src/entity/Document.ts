// src/entity/Document.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("documents")
export class Document {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 250, unique: true })
  title: string;

  @Column({ type: "varchar", length: 500, unique: true })
  code: string;

  @Column({ type: "varchar", length: 250 })
  file_name: string;

  @Column({ type: "varchar", length: 10 })
  extension: string;

  @Column({ type: "varchar", length: 100 })
  action_type: string; // e.g., PROFILE_PICTURE, GENERAL_GALLERY, PERSONAL_DOCUMENT

  @Column({ type: "enum", enum: ["DOC", "IMG", "OTHER"], default: "IMG" })
  type: "DOC" | "IMG" | "OTHER";

  @Column({ type: "varchar", length: 400, nullable: true, default: null })
  description: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  url: string | null;

  @Column({ type: "int", unsigned: true })
  id_for_table: number;

  @Column({ type: "varchar", length: 100, default: "GENERAL" })
  table: string;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "tinyint", default: 0 })
  is_public: boolean;

  @Column({ type: "int", unsigned: true })
  user_id: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;
}
