import { seedDatabase } from '../lib/seed.js';

// This script can be run with `npx ts-node scripts/seed.ts` to seed the database
console.log('Starting database seeding...');
seedDatabase()
  .then(() => {
    console.log('Seeding completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });