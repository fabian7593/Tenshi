// src/entity/RoleScreen.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./Role";
import { Screen } from "./Screen";

@Entity("role_screen")
export class RoleScreen {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 35 })
  role_code: string;

  @Column({ type: "varchar", length: 50 })
  screen_code: string;

  @Column({ type: "varchar", length: 400, nullable: true, default: null })
  description: string | null;

  @ManyToOne(() => Role, role => role.id)
  @JoinColumn({ name: "role_code", referencedColumnName: "code" })
  role: Role;

  @ManyToOne(() => Screen, screen => screen.id)
  @JoinColumn({ name: "screen_code", referencedColumnName: "code" })
  screen: Screen;
}
