/**
 * NOTE:RESTART_V1
 * RESTART_V1 is a flag used to check against
 * the test is done by having mix run once. Then files that are
 * matched by different globs would be changed by replacing that flag.
 * Every file have this flag, in some way.
 * Change to V2
 * And after restart we expect V2 instead of V1
 */

export default class Engine {
  constructor() {
    this.name = 'RESTART_V1:services/engine/core.js';
  }

  init() {
    return this;
  }
}
