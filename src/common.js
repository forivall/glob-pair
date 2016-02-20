
import path from 'path';
const pathFormat = path.format || require('path-format');
const pathParse = path.parse || require('path-parse');

export function replaceExt(dest, destExt) {
  if (!destExt) return dest;
  const p = pathParse(dest);
  p.base = path.basename(p.base, p.ext) + destExt;
  return pathFormat(p);
}
