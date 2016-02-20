import path from 'path';

import isGlob from 'is-glob';
import minimatch from 'minimatch';
const {Minimatch} = minimatch;

import {replaceExt} from './common';

// from minimatch: normalizes slashes.
export const slashSplit = /\/+/;

export default function dest(src, {src: srcGlobs, dest: destGlobs, destExt}) {
  const dLen = destGlobs.length;
  const oneDest = dLen === 1;
  const sLen = srcGlobs.length;
  for (let i = 0; i < sLen && (oneDest || i < dLen); i++) {
    const result = destOne(src, {src: srcGlobs[i], dest: destGlobs[oneDest ? 0 : i], destExt});
    if (result) return result;
  }
  return false;
}

// Returns the appropriate dest, or false if the src just doesn't match the glob
//
// see also: Minimatch#match()
export function destOne(src, {src: srcGlob, dest: destGlob, destExt}) {
  if (!isGlob(srcGlob) && src === srcGlob) {
    return replaceExt(destGlob, destExt);
  }

  const srcMm = new Minimatch(srcGlob);

  if (srcMm.comment) return false;
  if (srcMm.negate) {
    if (srcMm.match(src)) return path.join(destGlob, replaceExt(srcGlob, destExt));
    return false;
  }
  if (srcMm.empty) return path.join(destGlob, replaceExt(srcGlob, destExt));

  // from minimatch: windows support: need to use /, not \
  if (path.sep !== '/') {
    src = src.split(path.sep).join('/');
  }

  const srcParts = src.split(slashSplit);

  const set = srcMm.set;

  for (const pattern of set) {
    if (destGlob === '.') {
      if (srcMm.matchOne(srcParts, pattern) ||
          srcMm.matchOne(srcParts, pattern.concat(minimatch.GLOBSTAR))) {
        return replaceExt(src, destExt);
      }
    } else if (srcMm.matchOne(srcParts, pattern) ||
        srcMm.matchOne(srcParts, pattern.concat(minimatch.GLOBSTAR))) {
      return path.join(destGlob, replaceExt(srcParts.slice(pattern.length - 1).join('/'), destExt));
    }
  }
  // Didn't match!
  return false;
}
