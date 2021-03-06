import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Volunteer } from "./Volunteer";

@Entity()
export class ToReceiveFundsType_REF {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @OneToMany(type => Volunteer, volunteer => volunteer.toReceiveFundsType)
  volunteers: Volunteer[];
}
