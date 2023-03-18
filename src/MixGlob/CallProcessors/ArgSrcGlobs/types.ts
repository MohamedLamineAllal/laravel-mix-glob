import type { Glob, OutConfig } from '@Glob';

/**
 * files: are the glob matching against real files
 *
 * evaluations: are files mapped using the map function if provided. Or files otherwise
 *
 * processIndex: the current processed file index (iteration) Cartesian product
  every evaluation is a one dimension in the Cartesian product
  That index help when we have multiple globs. To manage the Cartesian space (All possibilities)
 */
export interface IGlobEvaluation {
  glob: Glob;
  files: string[];
  evaluations: any[];
  argIndex: number;
}

export interface IOutManagerRef {
  outConfig: OutConfig;
  argIndex: number;
}
