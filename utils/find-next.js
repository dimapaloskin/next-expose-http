import { resolve, join } from 'path';
import { exists } from 'mz/fs';

export default async (dir) => {

  const resolvedPath = resolve(join(dir));
  const currentNodeModules = join(resolvedPath, 'node_modules/next');
  const parrentNodeModules = join(resolvedPath, '../', 'node_modules/next');

  if (await exists(currentNodeModules)) {
    return currentNodeModules;
  }

  if (await exists(parrentNodeModules)) {
    return parrentNodeModules;
  }

  return false;
}
