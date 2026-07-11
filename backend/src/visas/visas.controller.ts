import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVisaDto } from './dto/create-visa.dto';
import { LookupVisaDto } from './dto/lookup-visa.dto';
import {
  assertNoFileValidationErrors,
  deleteUploadedFiles,
  RequestWithFileErrors,
  visaFileUploadOptions,
} from './multer.config';
import { VisasService } from './visas.service';

interface UploadedVisaFiles {
  visaPdf?: Express.Multer.File[];
  photo?: Express.Multer.File[];
  document?: Express.Multer.File[];
}

@Controller('visas')
export class VisasController {
  constructor(private readonly visasService: VisasService) {}

  @Post('lookup')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  lookup(@Body() dto: LookupVisaDto) {
    return this.visasService.lookup(dto);
  }

  @Get(':id/download')
  async download(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const { absolutePath, filename } = await this.visasService.getDownloadFile(id);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.sendFile(absolutePath);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.visasService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'visaPdf', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
        { name: 'document', maxCount: 1 },
      ],
      visaFileUploadOptions,
    ),
  )
  create(
    @Body() dto: CreateVisaDto,
    @UploadedFiles() files: UploadedVisaFiles,
    @Req() req: RequestWithFileErrors,
  ) {
    assertNoFileValidationErrors(req);

    if (!files?.visaPdf?.[0]) {
      deleteUploadedFiles([...(files?.photo ?? []), ...(files?.document ?? [])]);
      throw new BadRequestException('A visaPdf file (application/pdf) is required.');
    }

    return this.visasService.create(dto, {
      visaPdf: files.visaPdf[0],
      photo: files.photo?.[0],
      document: files.document?.[0],
    });
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.visasService.remove(id);
  }
}
