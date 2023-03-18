const fs = { promises: { rename() {} } };

export function moveFile(src, dest) {
  console.log('MOVE_FILE_V1');
  return fs.promises.rename(src, dest);
}
