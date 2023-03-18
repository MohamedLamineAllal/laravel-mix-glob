export function* loopCartesianProduct(sets: any[][]): Generator<any[]> {
  const iterationsIndexes = new Array(sets.length).fill(0);
  const lastIndex = iterationsIndexes.length - 1;

  while (true) {
    const cartesianEl = new Array(sets.length);
    sets.forEach((set, setIndex) => {
      cartesianEl[setIndex] = set[iterationsIndexes[setIndex]];
    });
    yield cartesianEl;

    /**
     * manage iterationsIndexes
     *
     * It works like the clock wheel. Once reach the last el. The precedent wheel move one step.
     * And so on each wheel reaching the end will trigger the one before it.
     */
    iterationsIndexes[lastIndex] += 1;
    let i = lastIndex;
    while (iterationsIndexes[i] > sets[i].length - 1) {
      iterationsIndexes[i] = 0;
      i -= 1;
      if (i === -1) {
        /**
         * We are done. All cartesian product elements were navigated
         */
        return;
      }
      iterationsIndexes[i] += 1;
    }
  }
}
