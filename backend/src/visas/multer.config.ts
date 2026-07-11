import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const UPLOADS_DIR = path.resolve(
  process.env.RAILWAY_VOLUME_MOUNT_PATH || process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads'),
);

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_MIMETYPES_BY_FIELD: Record<string, Record<string, string>> = {
  visaPdf: {
    'application/pdf': '.pdf',
  },
  photo: {
    'image/jpeg': '.jpg',
    'image/png': '.png',
  },
  document: {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  },
};

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export interface RequestWithFileErrors extends Express.Request {
  fileValidationErrors?: string[];
}

export const visaFileUploadOptions = {
  storage: diskStorage({
    destination: UPLOADS_DIR,
    filename: (req, file, callback) => {
      const extension = ALLOWED_MIMETYPES_BY_FIELD[file.fieldname]?.[file.mimetype] || '';
      callback(null, `${uuidv4()}${extension}`);
    },
  }),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (
    req: RequestWithFileErrors,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedForField = ALLOWED_MIMETYPES_BY_FIELD[file.fieldname];
    if (!allowedForField || !allowedForField[file.mimetype]) {
      req.fileValidationErrors = req.fileValidationErrors || [];
      req.fileValidationErrors.push(
        `Field "${file.fieldname}" must be one of [${Object.keys(allowedForField || {}).join(', ')}], got "${file.mimetype}".`,
      );
      callback(null, false);
      return;
    }
    callback(null, true);
  },
};

export function assertNoFileValidationErrors(req: RequestWithFileErrors): void {
  if (req.fileValidationErrors?.length) {
    throw new BadRequestException(req.fileValidationErrors);
  }
}

export function deleteUploadedFiles(files: Express.Multer.File[]): void {
  for (const file of files) {
    fs.promises.unlink(file.path).catch(() => undefined);
  }
}

export function deleteStoredFile(filename: string | null | undefined): void {
  if (!filename) {
    return;
  }
  fs.promises.unlink(path.join(UPLOADS_DIR, filename)).catch(() => undefined);
}
