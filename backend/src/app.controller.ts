import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  @Get(['admin', 'admin/login'])
  serveFrontend(@Res() res: Response): void {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }
}
