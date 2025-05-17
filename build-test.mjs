import { execSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';

try {
  rmSync('dist', { recursive: true, force: true });
  mkdirSync('dist');
  execSync('tsc src/utils/bracketUtils.ts --outDir dist --module NodeNext --target ESNext --moduleResolution NodeNext', { stdio: 'inherit' });
  execSync('node --test --experimental-test-coverage', { stdio: 'inherit' });
} catch (err) {
  console.error(err);
  process.exit(1);
}
