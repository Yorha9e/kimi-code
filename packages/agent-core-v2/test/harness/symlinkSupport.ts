/**
 * Test helper — probe whether the current process may create symlinks.
 *
 * On Windows, `fs.symlink` requires SeCreateSymbolicLinkPrivilege (an
 * elevated shell or Developer Mode); without it the call rejects with EPERM.
 * Symlink-dependent tests should probe once and skip when unsupported:
 *
 * ```ts
 * it('follows symlinks', async (ctx) => {
 *   if (!(await canCreateSymlinks())) ctx.skip();
 *   // …
 * });
 * ```
 */

import { mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let probe: Promise<boolean> | undefined;

/** Resolve once to whether symlink creation works in this environment. */
export function canCreateSymlinks(): Promise<boolean> {
  probe ??= (async () => {
    const dir = await mkdtemp(join(tmpdir(), 'kimi-symlink-probe-'));
    try {
      const target = join(dir, 'target.txt');
      await writeFile(target, 'probe', 'utf8');
      await symlink(target, join(dir, 'link.txt'));
      return true;
    } catch {
      return false;
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  })();
  return probe;
}
