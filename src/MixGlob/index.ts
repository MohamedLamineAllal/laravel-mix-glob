import mix, { Api as MixApi } from 'laravel-mix';
import { EGlobType, Glob } from '@Glob';
import { WatchingManager } from '@WatchingManager';
import { settingUpLogging } from '@Utils/Logger';
import { processArgsGlobCall } from './CallProcessors/ArgsTypeGlob';
import { ArgSrcGlobsProcessor } from './CallProcessors/ArgSrcGlobs';
import { TMappedExtendedApi } from './MixApiManager/types';
import { MixApiManager } from './MixApiManager';
import { IOptions } from './types';

export class MixGlob {
  public mix: MixApi;

  public originalMix: MixApi;

  public static originalMix: MixApi;

  public mixApiManager: MixApiManager;

  public watchingManager: WatchingManager;

  constructor(options: IOptions) {
    this.mix = options.mix || mix;
    this.originalMix = { ...this.mix };
    MixGlob.originalMix = MixGlob.originalMix || this.originalMix;
    settingUpLogging();
    this.mixApiManager = new MixApiManager({ mixGlob: this });
    this.watchingManager = new WatchingManager();
    /**
     * All watching related at init time are run
     */
    this.watchingManager.init();
  }

  // Note: probably adding a set settings method

  /**
   * laravel-mix call processing function after plugin extension
   * @param methodName function called through mix
   * @param args arguments the function was called with
   * @returns this
   */
  public processCall<TMethodName extends keyof MixApi>(
    methodName: TMethodName,
    args: Parameters<TMappedExtendedApi[TMethodName]>,
  ): this {
    const originalMethod = this.originalMix[methodName].bind(
      this.originalMix,
    ) as any;

    // No args
    if (args.length === 0) {
      originalMethod();
      return this;
    }

    // Glob of type args
    if (
      args.length === 1 &&
      args[0] instanceof Glob &&
      args[0].type === EGlobType.args
    ) {
      const { files } = processArgsGlobCall(args[0], originalMethod);

      if (this.watchingManager.watchingHandler.shouldWatch) {
        this.watchingManager.watchingHandler
          .watchForGlobs([args[0]])
          .addWatchedFiles(files);
      }

      return this;
    }

    /**
     * args need to be treated separately, Cartesian product.
     * If there is any glb.arg or glb.src objects.
     * And if not. It means no globs. And it would processed correctly as well.
     */
    const srcArgProcessor = new ArgSrcGlobsProcessor();
    srcArgProcessor.process(args, methodName, originalMethod);

    const globsEvaluations = srcArgProcessor.getGlobsEvaluations();

    if (this.watchingManager.watchingHandler.shouldWatch) {
      this.watchingManager.watchingHandler
        .watchForGlobs(
          globsEvaluations.map((globEvaluation) => globEvaluation.glob),
        )
        .addWatchedFiles(
          globsEvaluations.map((globEvaluation) => globEvaluation.files).flat(),
        );
    }

    return this;
  }
}
