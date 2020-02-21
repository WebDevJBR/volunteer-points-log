import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Kingdom } from './Kingdom';
import { Volunteer } from './Volunteer';

@Entity()
export class LocalGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(
    type => Kingdom,
    kingdom => kingdom.localGroups
  )
  kingdom: number;

  @OneToMany(
    type => Volunteer,
    volunteer => volunteer.localGroup
  )
  volunteers: Volunteer[];
}
