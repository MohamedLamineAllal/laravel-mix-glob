/**
 * NOTE:RESTART_V1
 * RESTART_V1 is a flag used to check against
 * the test is done by having mix run once. Then files that are
 * matched by different globs would be changed by replacing that flag.
 * Every file have this flag, in some way.
 * Change to V2
 * And after restart we expect V2 instead of V1
 */
import engine from './engine';

export default class SolidService {
  constructor() {
    this.engine = engine;
  }

  init() {
    engine.init('RESTART_V1:services/solid.service.js');
  }
}
