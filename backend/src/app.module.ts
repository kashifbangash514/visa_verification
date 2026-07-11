import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { Admin } from './entities/admin.entity';
import { Visa } from './entities/visa.entity';
import { VisasModule } from './visas/visas.module';

const PUBLIC_DIR = join(__dirname, '..', 'public');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        // Falls back to Railway's MySQL plugin variable names (MYSQLHOST, etc.)
        // so linking a MySQL service on Railway works with no extra mapping.
        host: config.get<string>('DB_HOST') || config.get<string>('MYSQLHOST') || 'localhost',
        port: Number(config.get<string>('DB_PORT') || config.get<string>('MYSQLPORT') || 3306),
        username: config.get<string>('DB_USERNAME') || config.get<string>('MYSQLUSER') || 'root',
        password: config.get<string>('DB_PASSWORD') || config.get<string>('MYSQLPASSWORD') || '',
        database: config.get<string>('DB_DATABASE') || config.get<string>('MYSQLDATABASE') || 'visa_verification',
        entities: [Visa, Admin],
        synchronize: false,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_DIR,
    }),
    AuthModule,
    VisasModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
