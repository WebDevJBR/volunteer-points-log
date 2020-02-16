import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { VolunteerTimeEntry } from "./VolunteerTimeEntry";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @Column({nullable:true})
  password: string;

  @Column({nullable: true})
  salt: string;

  @Column()
  admin: boolean;

  @OneToMany(type => VolunteerTimeEntry, timeEntry => timeEntry.enteredByUser)
  timeEntries: VolunteerTimeEntry[];
}
