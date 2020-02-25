import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DateRange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  activeYear: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

}
