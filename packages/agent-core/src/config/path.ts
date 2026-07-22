import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'pathe';

export function resolveKimiHome(homeDir?: string | undefined): string {
  // omkc home resolution: OMKC_HOME wins; KIMI_CODE_HOME stays honored so
  // existing sandboxes/tests that export it keep working; default is the
  // omkc-private ~/.omkc (not the shared ~/.kimi-code).
  return (
    homeDir ??
    process.env['OMKC_HOME'] ??
    process.env['KIMI_CODE_HOME'] ??
    join(homedir(), '.omkc')
  );
}

export function resolveConfigPath(input: {
  readonly homeDir?: string | undefined;
  readonly configPath?: string | undefined;
}): string {
  return input.configPath ?? join(resolveKimiHome(input.homeDir), 'config.toml');
}

export function ensureKimiHome(homeDir: string): void {
  mkdirSync(homeDir, { recursive: true, mode: 0o700 });
}
