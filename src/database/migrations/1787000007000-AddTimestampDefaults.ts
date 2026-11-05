import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Tables created by Django have no database-level defaults on their
 * auto_now / auto_now_add columns (Django fills them in Python). TypeORM's
 * @CreateDateColumn / @UpdateDateColumn instead emit `DEFAULT` on insert and
 * rely on the database, which produced NULLs and not-null violations
 * (e.g. gameplay_game.date_played). Give those columns a now() default.
 */
const TIMESTAMP_COLUMNS: Array<[table: string, column: string]> = [
  ['auth_user', 'date_joined'],
  ['authentication_userprofile', 'date_updated'],
  ['authtoken_token', 'created'],
  ['content_category', 'created_at'],
  ['content_category', 'updated_at'],
  ['content_savedcategory', 'saved_at'],
  ['content_categorylike', 'created_at'],
  ['gameplay_game', 'date_played'],
  ['payments_payment', 'created_at'],
  ['payments_payment', 'updated_at'],
  ['payments_subscription', 'created_at'],
  ['payments_subscription', 'updated_at'],
  ['payments_webhook_event', 'created_at'],
];

export class AddTimestampDefaults1787000007000 implements MigrationInterface {
  name = 'AddTimestampDefaults1787000007000';

  async up(queryRunner: QueryRunner): Promise<void> {
    for (const [table, column] of TIMESTAMP_COLUMNS) {
      if (await queryRunner.hasColumn(table, column)) {
        await queryRunner.query(
          `ALTER TABLE "${table}" ALTER COLUMN "${column}" SET DEFAULT now()`,
        );
      }
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    for (const [table, column] of TIMESTAMP_COLUMNS) {
      if (await queryRunner.hasColumn(table, column)) {
        await queryRunner.query(
          `ALTER TABLE "${table}" ALTER COLUMN "${column}" DROP DEFAULT`,
        );
      }
    }
  }
}
