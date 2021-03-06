import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { LocalGroup } from "./LocalGroup";
import { ToReceiveFundsType_REF } from "./toReceiveFundsType_REF";
import { VolunteerTimeEntry } from "./VolunteerTimeEntry";
import { Kingdom } from "./Kingdom";

@Entity()
export class Volunteer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique: true})
  mka: string;

  @Column({nullable: true})
  membershipNumber: string;

  @Column({nullable: true})
  feathersTaken: number;

  @Column({nullable: true})
  ticketsTaken: number;

  @Column({nullable: true})
  aboveAndBeyondTaken: number;

  @Column({nullable: true})
  twentyHours: boolean;
  
  @Column({nullable: true})
  fiftyHours: boolean;

  @Column({nullable: true})
  oneHundredHours: boolean;

  @Column({nullable: true})
  other: string;

  @Column()
  infoMissing: boolean;

  @ManyToOne(type => Kingdom, kingdom => kingdom.volunteers, {nullable: true})
  kingdom: number;

  @ManyToOne(type => LocalGroup, group => group.volunteers, {nullable: true})
  localGroup: number;

  @ManyToOne(type => ToReceiveFundsType_REF, toRec => toRec.volunteers)
  toReceiveFundsType: number;

  @OneToMany(type => VolunteerTimeEntry, timeEntry => timeEntry.volunteer)
  timeEntries: VolunteerTimeEntry[];
}
