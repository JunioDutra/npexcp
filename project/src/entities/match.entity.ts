import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MatchEventEntity } from './match-event.entity';

@Entity({ name: 'match' })
export class MatchEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'timestamp' })
  started_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  finished_at?: Date;

  @OneToMany(() => MatchEventEntity, (event) => event.match)
  events: MatchEventEntity[];
}
