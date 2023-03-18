export const SRC_OUT_FUNCTIONS: string[] = [
  'js',
  'ts',
  'sass',
  'css',
  'postCss',
  'coffee',
  'less',
  'stylus',
];

/**
 * Per function configuration. And override
 * ext: the output files extension mapping set for the function
 *
 * Note: †his is one type of mapping. Precedency matter check it in the doc.
 */
export const MIX_DEFAULT_FUNCTIONS_SETTINGS = {
  js: {
    outputMapping: {
      ext: '.js',
    },
  },
  ts: {
    outputMapping: {
      ext: '.js',
    },
  },
  sass: {
    outputMapping: {
      ext: '.css',
    },
  },
  css: {
    outputMapping: {
      ext: '.css',
    },
  },
  postCss: {
    outputMapping: {
      ext: '.css',
    },
  },
  less: {
    outputMapping: {
      ext: '.css',
    },
  },
  stylus: {
    outputMapping: {
      ext: '.css',
    },
  },
};

export type TMixFuncSettings = typeof MIX_DEFAULT_FUNCTIONS_SETTINGS;
