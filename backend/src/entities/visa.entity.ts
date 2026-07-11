import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum NumberOfEntries {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

export enum VisaStatus {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

@Entity({ name: 'visas' })
@Unique('UQ_visas_passport_evisa', ['passportNumber', 'evisaNumber'])
export class Visa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  applicantName: string;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  passportNumber: string;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  evisaNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  visaType: string | null;

  @Column({
    type: 'enum',
    enum: NumberOfEntries,
    default: NumberOfEntries.SINGLE,
  })
  numberOfEntries: NumberOfEntries;

  @Column({
    type: 'enum',
    enum: VisaStatus,
    default: VisaStatus.VALID,
  })
  status: VisaStatus;

  @Column({ type: 'date', nullable: true })
  submittedOn: string | null;

  @Column({ type: 'date', nullable: true })
  visaIssuedOn: string | null;

  @Column({ type: 'date', nullable: true })
  visaValidFrom: string | null;

  @Column({ type: 'date', nullable: true })
  visaValidUntil: string | null;

  @Column({ type: 'int', nullable: true })
  durationOfStayDays: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  issuedBy: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  referenceNumber: string | null;

  @Column({ type: 'varchar', length: 255 })
  visaPdfPath: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photoPath: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  documentPath: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
