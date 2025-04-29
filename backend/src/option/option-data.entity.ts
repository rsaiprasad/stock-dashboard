import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('option_data')
export class OptionDataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column({ type: 'date' })
  expiration_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  strike_price: number;

  @Column({ type: 'enum', enum: ['call', 'put'] })
  option_type: 'call' | 'put';

  @Column()
  open_interest: number;

  @Column()
  volume: number;
}
