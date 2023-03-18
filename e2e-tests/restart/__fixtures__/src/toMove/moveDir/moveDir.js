const fse = { move() {} };

export function move(src, dest) {
  console.log('MOVE_moveDir_V1');
  return fse.move(src, dest, { overwrite: true });
}
