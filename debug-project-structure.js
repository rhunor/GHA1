// Save this file as debug-project-structure.js and run with node debug-project-structure.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the project root (assumes this script is in project root)
const projectRoot = __dirname;

console.log('Project Structure Debug:');
console.log('=======================');
console.log(`Project root: ${projectRoot}`);

// Check src/scripts/seed.ts
const seedScriptPath = path.join(projectRoot, 'src', 'scripts', 'seed.ts');
console.log(`\nChecking seed script at: ${seedScriptPath}`);
if (fs.existsSync(seedScriptPath)) {
  console.log('✅ seed.ts exists');
  console.log('Content:');
  console.log('--------');
  console.log(fs.readFileSync(seedScriptPath, 'utf8'));
} else {
  console.log('❌ seed.ts does not exist!');
}

// Check src/lib/seed.ts
const seedLibPath = path.join(projectRoot, 'src', 'lib', 'seed.ts');
console.log(`\nChecking seed library at: ${seedLibPath}`);
if (fs.existsSync(seedLibPath)) {
  console.log('✅ lib/seed.ts exists');
  console.log('Content:');
  console.log('--------');
  console.log(fs.readFileSync(seedLibPath, 'utf8'));
} else {
  console.log('❌ lib/seed.ts does not exist!');
}

// Check if any .js versions exist (might be compiled TS)
const seedLibJsPath = path.join(projectRoot, 'src', 'lib', 'seed.js');
if (fs.existsSync(seedLibJsPath)) {
  console.log('\n⚠️ lib/seed.js exists (TypeScript might be compiled)');
}

// Check tsconfig.json
const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
console.log(`\nChecking tsconfig.json at: ${tsconfigPath}`);
if (fs.existsSync(tsconfigPath)) {
  console.log('✅ tsconfig.json exists');
  console.log('Content:');
  console.log('--------');
  console.log(fs.readFileSync(tsconfigPath, 'utf8'));
} else {
  console.log('❌ tsconfig.json does not exist!');
}