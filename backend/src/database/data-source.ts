import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Visa } from '../entities/visa.entity';
import { Admin } from '../entities/admin.entity';

// Falls back to Railway's MySQL plugin variable names (MYSQLHOST, etc.) so
// linking a MySQL service on Railway works with no extra mapping.
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10),
  username: process.env.DB_USERNAME || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
  database: process.env.DB_DATABASE || process.env.MYSQLDATABASE || 'visa_verification',
  entities: [Visa, Admin],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
