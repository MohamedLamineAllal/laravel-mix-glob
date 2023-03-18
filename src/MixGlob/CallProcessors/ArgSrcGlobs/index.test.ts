import path from 'path';
import * as glb from '@Helpers';
import { ArgSrcGlobsProcessor } from './index';

const fixtureDir = path.join(__dirname, './__fixtures__');

interface ITestObj {
  name?: string;
  methodName: string;
  args: any[];
  expected: any[][];
}

function runTests(category: string, tests: ITestObj[]): void {
  tests.forEach((tst, index) => {
    test(
      tst.name
        ? `${category}: ${tst.name}`
        : `${category}: test of index ${index}`,
      () => {
        const processor = new ArgSrcGlobsProcessor();
        let execIndex = 0;
        processor.process(tst.args as any, tst.methodName, ((
          ...args: any[]
        ) => {
          expect(args).toEqual(tst.expected[execIndex]);
          execIndex += 1;
        }) as any);
      },
    );
  });
}

runTests('cartesian product and args arguments works well', [
  {
    methodName: 'ts',
    args: [
      glb.src(path.resolve(`${fixtureDir}/src/**/index.ts`)),
      glb.out({
        baseMap: path.resolve(`${fixtureDir}/src/`),
        outMap: path.resolve(`${fixtureDir}/dist/`),
      }),
      glb.arg([
        path.resolve(`${fixtureDir}/src/utils/*.ts`),
        path.resolve(`${fixtureDir}/src/core/lib.ts`),
      ]),
      'some-normal-arg',
    ],
    expected: [
      [
        path.resolve(`${fixtureDir}/src/index.ts`),
        path.resolve(`${fixtureDir}/dist/index.js`),
        path.resolve(`${fixtureDir}/src/core/lib.ts`),
        'some-normal-arg',
      ],
      [
        path.resolve(`${fixtureDir}/src/index.ts`),
        path.resolve(`${fixtureDir}/dist/index.js`),
        path.resolve(`${fixtureDir}/src/utils/logger.ts`),
        'some-normal-arg',
      ],
      [
        path.resolve(`${fixtureDir}/src/core/index.ts`),
        path.resolve(`${fixtureDir}/dist/core/index.js`),
        path.resolve(`${fixtureDir}/src/core/lib.ts`),
        'some-normal-arg',
      ],
      [
        path.resolve(`${fixtureDir}/src/core/index.ts`),
        path.resolve(`${fixtureDir}/dist/core/index.js`),
        path.resolve(`${fixtureDir}/src/utils/logger.ts`),
        'some-normal-arg',
      ],
    ],
  },
]);
