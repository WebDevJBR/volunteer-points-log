import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Department } from "./Department";
import { User } from "./User";
import { Volunteer } from "./Volunteer";

@Entity()
export class VolunteerTimeEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timeIn: Date;

  @Column()
  timeOut: Date;

  @Column()
  multiplier: number;

  @Column({nullable: true})
  comments: string;

  @ManyToOne(type => Department, department => department.timeEntries)
  department: number;

  @ManyToOne(type => User, user => user.timeEntries)
  enteredByUser: number;

  @ManyToOne(type => Volunteer, volunteer => volunteer.timeEntries)
  volunteer: number;
}
