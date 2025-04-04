import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { generateEntityId } from "@medusajs/utils" // Utility for generating IDs

@Entity()
export class Product {
  // Define the primary key, matching Medusa's standard 'id' column
  @PrimaryKey({ type: 'string' })
  id!: string;

  // Cigar-specific fields
  @Property({ type: 'string', nullable: true })
  wrapper: string | null = null;

  @Property({ type: 'string', nullable: true })
  binder: string | null = null;

  @Property({ type: 'string', nullable: true })
  filler: string | null = null;

  @Property({ type: 'string', nullable: true })
  strength: string | null = null; // e.g., Mild, Medium, Full

  @Property({ type: 'string', nullable: true })
  origin: string | null = null; // e.g., Nicaragua, Cuba, Dominican Republic

  @Property({ type: 'string', nullable: true })
  vitola: string | null = null; // e.g., Robusto, Toro, Churchill

  @Property({ type: 'string', nullable: true })
  length_inches: string | null = null; // Store as string for flexibility

  @Property({ type: 'number', nullable: true })
  ring_gauge: number | null = null; // e.g., 50, 52, 60

  // Accessory-specific fields
  @Property({ type: 'string', nullable: true })
  material: string | null = null;

  @Property({ type: 'string', nullable: true })
  brand: string | null = null;

  // Add a constructor to initialize the ID using Medusa's utility
  constructor() {
    this.id = generateEntityId(this.id, "prod") // "prod" is the standard prefix for product IDs
  }
}