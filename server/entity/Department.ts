import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Volunteer } from "./Volunteer";
import { VolunteerTimeEntry } from './VolunteerTimeEntry';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(type => Volunteer)
  @JoinColumn()
  deputyVolunteer: number;

  @OneToOne(type => Volunteer)
  @JoinColumn()
  headVolunteer: number;

  @OneToMany(type => VolunteerTimeEntry, timeEntry => timeEntry.department)
  timeEntries: VolunteerTimeEntry[];
}
