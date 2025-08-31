import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexing1756672339783 implements MigrationInterface {
    name = 'AddIndexing1756672339783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE INDEX idx_feed_user_type_created_id 
          ON activity(userId, type, createdAt DESC, id DESC)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE INDEX idx_feed_user_type_created_id 
          ON activity(userId, type, createdAt DESC, id DESC)
        `);
    }

}
