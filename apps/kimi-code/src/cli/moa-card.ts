/**
 * moa-card companion launcher.
 *
 * omkc can ship an optional Tauri floating-card app at
 * `<dataDir>/bin/moa-card.exe` (`moa-card` elsewhere). Interactive startup
 * launches it best-effort: a missing binary or a spawn failure must never
 * block or break the CLI.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { getBinDir } from '#/utils/paths';

export function maybeLaunchMoaCard(enabled: boolean): void {
  if (!enabled) return;
  const exePath = join(
    getBinDir(),
    process.platform === 'win32' ? 'moa-card.exe' : 'moa-card',
  );
  if (!existsSync(exePath)) return;
  // Fire-and-forget: detached with ignored stdio so the card never touches
  // the terminal, unref'd so it cannot keep the CLI event loop alive. Spawn
  // errors (e.g. a corrupt binary) are swallowed. We spawn the .exe directly
  // without shell: true, which is only for .cmd shims (CVE-2024-27980).
  const child = spawn(exePath, [], {
    detached: true,
    stdio: 'ignore',
    windowsHide: process.platform === 'win32' ? true : undefined,
  });
  child.on('error', () => {});
  child.unref();
}
