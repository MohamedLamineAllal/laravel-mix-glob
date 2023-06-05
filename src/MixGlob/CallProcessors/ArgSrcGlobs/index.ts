import { Api as MixApi } from 'laravel-mix';
import { TExtendedApi } from '@MixGlob/MixApiManager/types';
import { Glob } from '@Glob';
import { OutConfig } from '@Glob/OutConfig';
import { EGlobType } from '@Glob/Glob';
import { globResolve } from '@Glob/globResolve';
import { mapSrcFile } from '@MixGlob/OutManager';
import { loopCartesianProduct } from '@Utils/CartisianProductLoop';
import { TMapArgsCallback } from '@Glob/types';
import { LOGGER } from '@Utils/Logger';
import { checkAllEvaluationsAreValid } from './EvaluationValidation';
import { IGlobEvaluation, IOutManagerRef } from './types';

/**
 * Process glb.src or glb.arg
 */
export class ArgSrcGlobsProcessor {
  private _globsEvaluations: IGlobEvaluation[] = [];

  private _outManagerRef?: IOutManagerRef;

  private _isEvaluationsValid = true;

  public getGlobsEvaluations(): IGlobEvaluation[] {
    return this._globsEvaluations;
  }

  public isEvaluationsValid() {
    return this._isEvaluationsValid;
  }

  private _resolveGlobsArguments(args: any[]): void {
    this._globsEvaluations = [];
    this._outManagerRef = undefined;

    args.forEach((arg, index) => {
      //  Treat Glob{src} or Glob{arg} arg type
      if (
        arg instanceof Glob &&
        [EGlobType.src, EGlobType.arg].includes(arg.type)
      ) {
        const globEvaluation: IGlobEvaluation = {
          glob: arg,
          argIndex: index,
          files: [],
          evaluations: [],
        };
        this._globsEvaluations!.push(globEvaluation);
        globEvaluation.files = globResolve(globEvaluation.glob.value);
        globEvaluation.evaluations = globEvaluation.files;

        if (globEvaluation.files.length === 0) {
          LOGGER.log(`No matched files for the Glob of arg of index ${index}`);
          return;
        }

        /**
         * if not src but arg, run the map if provided.
         * Src files match against real files. So no mapping make no sense.
         */
        if (arg.type === EGlobType.arg && globEvaluation.glob.options?.map) {
          globEvaluation.evaluations = globEvaluation.files.map(
            globEvaluation.glob.options.map as TMapArgsCallback,
          );
        }
        return;
      }

      if (arg instanceof OutConfig) {
        this._outManagerRef = {
          outConfig: arg,
          argIndex: index,
        };
      }
    });
  }

  /**
   * If this is called for the first time resolveGlobsArguments() is called for you.
   * If not and that means args already resolved once. Either you want to resolve them again
   * (new args and want to keep using the same instance). You get to use resolveGlobsArguments()
   * again to do so. Otherwise if not and you know what you are doing you can call it again
   * directly using the old args and resolution
   * @param args
   * @param originalMethod
   */
  public process<TMethodName extends keyof MixApi>(
    args: Parameters<TExtendedApi[TMethodName]>,
    originalMethodName: string,
    originalMethod: (...argss: Parameters<MixApi[TMethodName]>) => MixApi,
  ): void {
    this._resolveGlobsArguments(args);

    if (this._globsEvaluations && this._globsEvaluations.length > 0) {
      if (!checkAllEvaluationsAreValid(this._globsEvaluations)) {
        LOGGER.debug('EVALUATION NOT VALID: skip execution!');
        this._isEvaluationsValid = false;
        return;
      }

      const loopGlobsCartesianProdGen = loopCartesianProduct(
        this._globsEvaluations!.map((evaluation) => evaluation.evaluations),
      );

      let cartesianProductResult: IteratorResult<any[]> =
        loopGlobsCartesianProdGen.next();

      while (!cartesianProductResult.done) {
        const finalCallArgs = [...args] as any[];
        this._globsEvaluations?.forEach(
          ({ argIndex, glob }, evaluationIndex) => {
            finalCallArgs[argIndex] =
              cartesianProductResult.value[evaluationIndex];
            if (glob.type === EGlobType.src && this._outManagerRef) {
              finalCallArgs[this._outManagerRef.argIndex] = mapSrcFile(
                cartesianProductResult.value[evaluationIndex],
                originalMethodName,
                this._outManagerRef.outConfig,
              );
            }
          },
        );
        originalMethod(...(finalCallArgs as any));
        cartesianProductResult = loopGlobsCartesianProdGen.next();
      }
      return;
    }

    /**
     * If no globs at all. Normal call without using globs
     */
    originalMethod(...(args as any));
  }
}
