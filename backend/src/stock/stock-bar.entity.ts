import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export enum TimeframeEnum {
  '1Min' = '1Min',
  '5Min' = '5Min',
  '15Min' = '15Min',
  '1Hour' = '1Hour',
  '1Day' = '1Day',
}

@Entity('stock_bars')
@Index(['symbol', 'timeframe', 'timestamp'], { unique: true })
export class StockBarEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column({
    type: 'enum',
    enum: TimeframeEnum,
  })
  timeframe: TimeframeEnum;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  open: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  high: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  low: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  close: number;

  @Column({ type: 'bigint' })
  volume: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  vwap: number;

  @Column()
  trade_count: number;
}
