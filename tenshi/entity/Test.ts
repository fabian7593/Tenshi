import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("test")
export class Test {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 200 })
  test_name: string;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  email: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;
}
