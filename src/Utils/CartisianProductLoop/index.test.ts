import { loopCartesianProduct } from './index';

interface ITestObj {
  name?: string;
  sets: string[][];
  expected: string[][];
}

function runTests(category: string, tests: ITestObj[]): void {
  tests.forEach((tst, index) => {
    test(
      tst.name
        ? `${category}: ${tst.name}`
        : `${category}: test of index ${index}`,
      () => {
        const generator = loopCartesianProduct(tst.sets);
        let iterVal: IteratorResult<string[]> = generator.next();
        let iterIndex = 0;
        while (!iterVal.done) {
          expect(iterVal.value).toEqual(tst.expected[iterIndex]);
          iterIndex += 1;
          iterVal = generator.next();
          if (iterIndex > tst.expected.length - 1) {
            expect(iterVal.done).toBeTruthy();
          } else {
            expect(iterVal.done).toBeFalsy();
          }
        }
      },
    );
  });
}

runTests('Cartesian product generator working as expected', [
  {
    name: 'Multiple sets (> 2)',
    sets: [
      ['s1-0', 's1-1'],
      ['s2-0', 's2-1', 's2-2'],
      ['s3-0', 's3-1', 's3-2', 's3-3'],
    ],
    expected: [
      ['s1-0', 's2-0', 's3-0'],
      ['s1-0', 's2-0', 's3-1'],
      ['s1-0', 's2-0', 's3-2'],
      ['s1-0', 's2-0', 's3-3'],
      ['s1-0', 's2-1', 's3-0'],
      ['s1-0', 's2-1', 's3-1'],
      ['s1-0', 's2-1', 's3-2'],
      ['s1-0', 's2-1', 's3-3'],
      ['s1-0', 's2-2', 's3-0'],
      ['s1-0', 's2-2', 's3-1'],
      ['s1-0', 's2-2', 's3-2'],
      ['s1-0', 's2-2', 's3-3'],
      ['s1-1', 's2-0', 's3-0'],
      ['s1-1', 's2-0', 's3-1'],
      ['s1-1', 's2-0', 's3-2'],
      ['s1-1', 's2-0', 's3-3'],
      ['s1-1', 's2-1', 's3-0'],
      ['s1-1', 's2-1', 's3-1'],
      ['s1-1', 's2-1', 's3-2'],
      ['s1-1', 's2-1', 's3-3'],
      ['s1-1', 's2-2', 's3-0'],
      ['s1-1', 's2-2', 's3-1'],
      ['s1-1', 's2-2', 's3-2'],
      ['s1-1', 's2-2', 's3-3'],
    ],
  },
  {
    name: 'One set only (= 1)',
    sets: [['s1-1', 's1-2', 's1-3']],
    expected: [['s1-1'], ['s1-2'], ['s1-3']],
  },
]);
