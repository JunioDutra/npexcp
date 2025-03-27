import { LogAction } from 'src/dtos';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MatchEntity } from './match.entity';

@Entity({ name: 'match_event' })
export class MatchEventEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => MatchEntity, (match) => match.events)
  match: MatchEntity;

  @Column({ type: 'timestamp' })
  when: Date;

  @Column({ type: 'enum', enum: LogAction })
  action: LogAction;

  @Column({ nullable: true })
  player1?: string;

  @Column({ nullable: true })
  player2?: string;

  @Column({ nullable: true })
  weapon?: string;

  @Column({ nullable: true })
  how?: string;
}
