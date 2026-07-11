import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import dataSource from '../database/data-source';
import { Admin } from '../entities/admin.entity';

async function run() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in the environment to seed an admin user.');
    process.exitCode = 1;
    return;
  }

  await dataSource.initialize();

  try {
    const adminRepository = dataSource.getRepository(Admin);
    const existing = await adminRepository.findOne({ where: { username } });

    if (existing) {
      console.log(`Admin user "${username}" already exists. Skipping seed.`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = adminRepository.create({ username, passwordHash });
    await adminRepository.save(admin);

    console.log(`Admin user "${username}" created successfully.`);
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error) => {
  console.error('Failed to seed admin user:', error);
  process.exitCode = 1;
});
