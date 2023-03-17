const fastGlob = require('fast-glob');
const path = require('path');
const fs = require('fs');

(async () => {
  const files = await fastGlob(path.resolve(__dirname, './src/**/*.d.ts'));
  files.forEach(async (file) => {
    const dir = path.dirname(file);

    await fs.promises.rm(file);
  });
})();
