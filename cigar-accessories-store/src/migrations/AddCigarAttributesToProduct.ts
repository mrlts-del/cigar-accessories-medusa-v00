import { Migration } from '@mikro-orm/migrations';

// Use a timestamp for uniqueness if needed, e.g., 20250404100000
// Or keep the descriptive name if the runner handles it.
export class AddCigarAttributesToProduct extends Migration {

  override async up(): Promise<void> {
    // Add custom columns to the existing product table
    this.addSql(`alter table "product" add column if not exists "wrapper" varchar null;`);
    this.addSql(`alter table "product" add column if not exists "binder" varchar null;`);
    this.addSql(`alter table "product" add column if not exists "filler" varchar null;`);
    this.addSql(`alter table "product" add column if not exists "strength" varchar null;`);
    this.addSql(`alter table "product" add column if not exists "origin" varchar null;`);
    this.addSql(`alter table "product" add column if not exists "vitola" varchar null;`);
    this.addSql(`alter table "product" add column if not exists "length_inches" varchar null;`);
    this.addSql(`alter table "product" add column if not exists "ring_gauge" integer null;`);
  }

  override async down(): Promise<void> {
    // Remove custom columns if rolling back
    this.addSql(`alter table "product" drop column if exists "wrapper";`);
    this.addSql(`alter table "product" drop column if exists "binder";`);
    this.addSql(`alter table "product" drop column if exists "filler";`);
    this.addSql(`alter table "product" drop column if exists "strength";`);
    this.addSql(`alter table "product" drop column if exists "origin";`);
    this.addSql(`alter table "product" drop column if exists "vitola";`);
    this.addSql(`alter table "product" drop column if exists "length_inches";`);
    this.addSql(`alter table "product" drop column if exists "ring_gauge";`);
  }

}