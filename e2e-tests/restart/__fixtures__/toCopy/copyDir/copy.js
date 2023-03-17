const fs = { promises: { copyFile() {} } };

export function copyFile(src, dest) {
  console.log('COPY_FILE_V1');
  return fs.promises.copyFile(src, dest);
}
