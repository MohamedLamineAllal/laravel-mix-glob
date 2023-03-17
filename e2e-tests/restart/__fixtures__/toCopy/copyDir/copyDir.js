const fse = { copy() {} };

export function copy(src, dest) {
  return fse.copy(src, dest, { recursive: true });
}
