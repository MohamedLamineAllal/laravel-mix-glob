import { checkAllEvaluationsAreValid } from './index';

interface INoFileMatchingTest {
  message: string;
  input: {
    files: string[] | undefined;
  }[];
  expected: boolean;
}

describe('No files matching', () => {
  function runTests(tests: INoFileMatchingTest[]): void {
    tests.forEach((_test, index) => {
      test(`Test ${index + 1}: ${_test.message}`, () => {
        const result = checkAllEvaluationsAreValid(_test.input as any);
        expect(result).toBe(_test.expected);
      });
    });
  }

  runTests([
    {
      message: 'Fail, only one evaluation',
      input: [
        {
          files: undefined,
        },
      ],
      expected: false,
    },
    {
      message: 'Fail, multiple evaluation, one no match, one with match',
      input: [
        {
          files: undefined,
        },
        {
          files: ['some.file'],
        },
      ],
      expected: false,
    },
    {
      message: 'Valid, one evaluation',
      input: [
        {
          files: ['Some.file'],
        },
      ],
      expected: true,
    },
    {
      message: 'Valid, multiple matching evaluations',
      input: [
        {
          files: ['Some.file'],
        },
        {
          files: ['some2.file'],
        },
      ],
      expected: true,
    },
  ]);
});
