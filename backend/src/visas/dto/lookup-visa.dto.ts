import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LookupVisaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  passportNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  evisaNumber: string;
}
