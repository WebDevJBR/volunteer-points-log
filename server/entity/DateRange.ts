import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DateRange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

}
