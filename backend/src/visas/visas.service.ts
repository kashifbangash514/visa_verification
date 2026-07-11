import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { NumberOfEntries, Visa, VisaStatus } from '../entities/visa.entity';
import { CreateVisaDto } from './dto/create-visa.dto';
import { LookupVisaDto } from './dto/lookup-visa.dto';
import { toAdminVisaResponse, VisaAdminResponse } from './dto/visa-admin-response';
import { toPublicVisaResponse, VisaPublicResponse } from './dto/visa-public-response';
import { deleteStoredFile, deleteUploadedFiles, UPLOADS_DIR } from './multer.config';

interface CreateVisaFiles {
  visaPdf: Express.Multer.File;
  photo?: Express.Multer.File;
  document?: Express.Multer.File;
}

const DUPLICATE_ENTRY_ERROR_CODE = 'ER_DUP_ENTRY';

@Injectable()
export class VisasService {
  constructor(
    @InjectRepository(Visa)
    private readonly visaRepository: Repository<Visa>,
  ) {}

  async lookup(dto: LookupVisaDto): Promise<VisaPublicResponse> {
    const visa = await this.visaRepository.findOne({
      where: {
        passportNumber: dto.passportNumber,
        evisaNumber: dto.evisaNumber,
      },
    });

    if (!visa) {
      throw new NotFoundException('VISA not verified.');
    }

    return toPublicVisaResponse(visa);
  }

  async findAll(): Promise<VisaAdminResponse[]> {
    const visas = await this.visaRepository.find({ order: { createdAt: 'DESC' } });
    return visas.map(toAdminVisaResponse);
  }

  async create(dto: CreateVisaDto, files: CreateVisaFiles): Promise<VisaAdminResponse> {
    const uploadedFiles = [files.visaPdf, files.photo, files.document].filter(
      (file): file is Express.Multer.File => Boolean(file),
    );

    try {
      const visa = this.visaRepository.create({
        applicantName: dto.applicantName,
        passportNumber: dto.passportNumber,
        evisaNumber: dto.evisaNumber,
        nationality: dto.nationality ?? null,
        visaType: dto.visaType ?? null,
        numberOfEntries: dto.numberOfEntries ?? NumberOfEntries.SINGLE,
        status: dto.status ?? VisaStatus.VALID,
        submittedOn: dto.submittedOn ?? null,
        visaIssuedOn: dto.visaIssuedOn ?? null,
        visaValidFrom: dto.visaValidFrom ?? null,
        visaValidUntil: dto.visaValidUntil ?? null,
        durationOfStayDays: dto.durationOfStayDays ?? null,
        issuedBy: dto.issuedBy ?? null,
        referenceNumber: dto.referenceNumber ?? null,
        visaPdfPath: files.visaPdf.filename,
        photoPath: files.photo?.filename ?? null,
        documentPath: files.document?.filename ?? null,
      });

      const saved = await this.visaRepository.save(visa);
      return toAdminVisaResponse(saved);
    } catch (error) {
      deleteUploadedFiles(uploadedFiles);

      if (this.isDuplicateEntryError(error)) {
        throw new ConflictException('A visa with this passport number and e-visa number already exists.');
      }

      throw error;
    }
  }

  async getDownloadFile(id: number): Promise<{ absolutePath: string; filename: string }> {
    const visa = await this.visaRepository.findOne({ where: { id } });

    if (!visa) {
      throw new NotFoundException('VISA not verified.');
    }

    const absolutePath = path.join(UPLOADS_DIR, visa.visaPdfPath);

    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException('VISA document not found.');
    }

    const safeEvisaNumber = visa.evisaNumber.replace(/[^a-zA-Z0-9_-]/g, '_');

    return {
      absolutePath,
      filename: `visa-${safeEvisaNumber}.pdf`,
    };
  }

  async remove(id: number): Promise<void> {
    const visa = await this.visaRepository.findOne({ where: { id } });

    if (!visa) {
      throw new NotFoundException('VISA not verified.');
    }

    deleteStoredFile(visa.visaPdfPath);
    deleteStoredFile(visa.photoPath);
    deleteStoredFile(visa.documentPath);

    await this.visaRepository.delete(id);
  }

  private isDuplicateEntryError(error: unknown): boolean {
    return (
      Boolean(error) &&
      typeof error === 'object' &&
      (error as { code?: string }).code === DUPLICATE_ENTRY_ERROR_CODE
    );
  }
}
