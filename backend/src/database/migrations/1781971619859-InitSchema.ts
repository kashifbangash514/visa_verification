import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1781971619859 implements MigrationInterface {
  name = 'InitSchema1781971619859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`admins\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`username\` VARCHAR(100) NOT NULL,
        \`passwordHash\` VARCHAR(255) NOT NULL,
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_admins_username\` (\`username\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE \`visas\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`applicantName\` VARCHAR(150) NOT NULL,
        \`passportNumber\` VARCHAR(50) NOT NULL,
        \`evisaNumber\` VARCHAR(50) NOT NULL,
        \`nationality\` VARCHAR(100) NULL,
        \`visaType\` VARCHAR(50) NULL,
        \`numberOfEntries\` ENUM('SINGLE', 'MULTIPLE') NOT NULL DEFAULT 'SINGLE',
        \`status\` ENUM('VALID', 'EXPIRED', 'REVOKED') NOT NULL DEFAULT 'VALID',
        \`submittedOn\` DATE NULL,
        \`visaIssuedOn\` DATE NULL,
        \`visaValidFrom\` DATE NULL,
        \`visaValidUntil\` DATE NULL,
        \`durationOfStayDays\` INT NULL,
        \`issuedBy\` VARCHAR(50) NULL,
        \`referenceNumber\` VARCHAR(50) NULL,
        \`visaPdfPath\` VARCHAR(255) NOT NULL,
        \`photoPath\` VARCHAR(255) NULL,
        \`documentPath\` VARCHAR(255) NULL,
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX \`IDX_visas_passportNumber\` (\`passportNumber\`),
        INDEX \`IDX_visas_evisaNumber\` (\`evisaNumber\`),
        UNIQUE INDEX \`UQ_visas_passport_evisa\` (\`passportNumber\`, \`evisaNumber\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`visas\`;`);
    await queryRunner.query(`DROP TABLE \`admins\`;`);
  }
}
