import { LOGGER } from '@Utils/Logger';
import { IGlobEvaluation } from '../types';

/**
 * Checks that evaluations are valid to be processed.
 * @param {IGlobEvaluation[]} globsEvaluations globs evaluations list
 * @return {boolean} valid or not valid
 */
export function checkAllEvaluationsAreValid(
  globsEvaluations: IGlobEvaluation[],
): boolean {
  // Not valid if one of glob evaluations match no files
  {
    const noFilesMatchesEvaluation = globsEvaluations.find(
      (globEvaluation) =>
        !globEvaluation?.files?.length || globEvaluation.files.length === 0,
    );

    if (noFilesMatchesEvaluation) {
      LOGGER.debug(
        'EVALUATION NOT VALID: One of glob evaluations matches no files.',
        JSON.stringify(noFilesMatchesEvaluation, null, 4),
      );
      return false;
    }
  }
  return true;
}
