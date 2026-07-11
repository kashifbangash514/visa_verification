import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { NumberOfEntries, VisaStatus } from '../../entities/visa.entity';

export class CreateVisaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  applicantName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  passportNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  evisaNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nationality?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  visaType?: string;

  @IsOptional()
  @IsEnum(NumberOfEntries)
  numberOfEntries?: NumberOfEntries;

  @IsOptional()
  @IsEnum(VisaStatus)
  status?: VisaStatus;

  @IsOptional()
  @IsDateString()
  submittedOn?: string;

  @IsOptional()
  @IsDateString()
  visaIssuedOn?: string;

  @IsOptional()
  @IsDateString()
  visaValidFrom?: string;

  @IsOptional()
  @IsDateString()
  visaValidUntil?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(3650)
  durationOfStayDays?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  issuedBy?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  referenceNumber?: string;
}
