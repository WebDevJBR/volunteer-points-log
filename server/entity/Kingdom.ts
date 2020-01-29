import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { LocalGroup } from "./LocalGroup";
import { Volunteer } from "./Volunteer";

@Entity()
export class Kingdom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => LocalGroup, group => group.kingdom)
  localGroups: LocalGroup[];

  @OneToMany(type => Volunteer, volunteer => volunteer.kingdom)
  volunteers: Volunteer[];
}
