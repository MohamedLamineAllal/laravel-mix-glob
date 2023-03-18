# Contributing to laravel-mix-glob

Thank you for your interest in contributing to `laravel-mix-glob`!

## Code of Conduct

Be nice.

All contributors are expected to follow  [rust code of conduct]. (I love rust).

## Bug reports

We can't fix what we don't know about, so please report problems. This
includes problems with understanding the documentation, unhelpful error messages,
and unexpected behavior.

You can open a new issue by following [this link][new-issues].

## Feature requests

Please feel free to open an issue using the [feature request template][new-issues].

## Working on issues

Feel free to ask for guidelines on how to tackle a problem by opening a
[new issue][new-issues] or opening a new discussion on the [Contribution and issues channel][Contribution-and-issues-discussion].

If you start working on an already-filed issue, post a comment on this issue to
let people know that somebody is working it. Feel free to ask for comments if
you are unsure about the solution you would like to submit.

We use the "fork and pull" model [described here][development-models], where
contributors push changes to their personal fork and create pull requests to
bring those changes into the source repository.

Steps to get started:

-   Fork laravel-mix-glob and create a branch from master for the issue you are working on.
-   Make sure to install the recommended extension (details bellow) 
-   `pnpm i` to install all dependencies (this repo use pnpm).
-   Please adhere to the code style that you see around the location you are
    working on.
-   Commit as you go.
-   Include tests that cover all non-trivial code. The unit tests go with the same level as the code it tests. While end to end go on `e2e-tests` directory.
-   You have to build before you run tests `npm run build`.
-   Run `npm run buildAndTest` to build and test. And make sure that it passes. Otherwise `npm run test` to just run the tests.
-   All code changes are expected to comply with the formatting suggested by `eslint` and `prettier`.
-   Push your commits to GitHub and create a pull request against the `MohamedLamineAllal/laravel-mix-glob` `master` branch.

## Getting your development environment set up

We do use `eslint` for code style. `prettier` for formatting. `commit-lint` with `lefthook` for commit messages linting.

All you need to do is to install the dependencies. And setup some vscode extensions (case u are using vscode. Which we do recommend) otherwise see the equivalent for your IDE.

### Install dependencies:

```
pnpm install
```

That would install typescript, eslint, prettier and all development and no development dependencies.

> (we are using pnpm). Make sure to have `pnpm` installed and to use it and not `npm` or `yarn`.

Check `packageJson.scripts` to check build commands ...

> Know too that the command above will execute `npx ts-patch install -s` which would patch the local typescript with ts-patch so that it support transformers. Which is required for a  c

### Install recommended extensions

Makes sure you install the recommended extensions:

```sh
"dbaeumer.vscode-eslint",
"esbenp.prettier-vscode",
"streetsidesoftware.code-spell-checker"
```

So you enable the linting on vscode and prettier formatting. Normally if not already installed on your system. We set a configuration that would normally prompt you for installation. If not you can use the id's above to search for the extensions.

Make sure to use the code-spell-checker.

## Code style

Follow the linter code style. And take a look at the project and the around code to see the followed conventions.

Through vscode (or IDE)

Or

```sh
npm run lint
```

## Build

```sh
npm run build
```

This would use rollup to build. With patched typescript through ts-patch.

## Tests

There is `unit tests` like [src/Utils/CartisianProductLoop/index.test.ts](./src/Utils/CartisianProductLoop/index.test.ts). Units tests go at the same level as the code `index.ts` => `index.test.ts`. And we are using typescript format.

And there is end to end testing that go on `e2e-tests` directory. And we are using `javascript` only. You can check the tests, the helpers (tests utils), `runMixCommand()` and the fixtures directories named `__fixtures__`. Follow the same style and approaches.

Before running test you have to build first:

```sh
npm run build
```

Make sure all the tests pass by running:

```sh
npm run test
```

You can build and test directly through

```sh
npm run buildAndTest
```

## Running one test only

While working on specific test suite, individual tests can be run by specifying a test file (suite)

```sh
npm run test -- e2e-tests/javascript/javascript.test.js
```

Use get relative path to make sure you highlight the right test.

```sh
npm run test -- src/WatchingManager/Cache/index.test.ts
```

## Pull requests

After the pull request is made, one of the developers will review your code.  
The review-process will make sure that the proposed changes are sound.  
Please give the assigned reviewer sufficient time, especially during weekends.  

A merge of laravel-mix-glob mastr-branch and your changes is immediately queued
to be tested after the pull request is made. In case unforeseen
problems are discovered during this step (e.g. a failure on a platform you
originally did not develop on), you may ask for guidance. Push additional
commits to your branch to tackle these problems.

The reviewer might point out changes deemed necessary. Please add them as
extra commits; this ensures that the reviewer can see what has changed since
the code was previously reviewed. Large or tricky changes may require several
passes of review and changes.

Once the reviewer approves your pull request, it will be merged into the laravel-mix-glob `master` branch.

## Contributing to the documentation

The laravel-mix-glob documentation can be found at [`documentation directory`](./documentation).

You can contribute to it if you see anything that can improve it. laravel-mix-glob@2 can be found at [`documentation/v2/README.md`](./documentation/v2/README.md).

You can open issues or open discussions. As well as directly fill a PR.

After you add anything to the documentation. Run `npm run docs:build`. To build and re-generate the repo `README.md`.

### Code examples

Please contribute code examples if you see it would help you or others. Add files at `documentation/v2/examples`. Go with whatever name that makes sense.

## Extension resolution

As mentioned on the documentation. There is mix functions based mapping. And standard extension resolution mapping.

If you all on any situation where a mapping is not by default supported. You can open a PR to add the support for it.

Mix functions based mapping can be found at:  
`src/MixFunctionSettings/index.ts`

```ts
export const MIX_DEFAULT_FUNCTIONS_SETTINGS = {
  js: {
    outputMapping: {
      ext: '.js',
    },
  },
  ts: {
    outputMapping: {
      ext: '.js',
    },
  },
  // ...
```

Standard extension resolution mapping can be found at:  
`src/MixGlob/OutManager/extensionMapping.ts`

```ts
export const EXTENSION_MAPPING = [
  {
    resolution: /\.[jt]sx?$|\.[cm]?[jt]s$/,
    extension: '.js',
  },
  {
    resolution: /\.s?css$|\.(le|sa)ss$|\.styl(us)?$/,
    extension: '.css',
  },
];
```

## Star the project

Star the project so more people start to use it.

🤜 \ [let me star ✨✨✨](https://github.com/MohamedLamineAllal/laravel-mix-glob)

## Write articles showing how to use the extension

If  you write any article anywhere. That would help people to get to know the extension. If you do write anywhere. Please share the links by opening a [discussion](https://github.com/MohamedLamineAllal/laravel-mix-glob/discussions/) 


[gist]: https://gist.github.com/
[new-issues]: https://github.com/MohamedLamineAllal/laravel-mix-glob/issues/new/choose
[Contribution-and-issues-discussion]: https://github.com/MohamedLamineAllal/laravel-mix-glob/discussions/categories/contribution-and-issues
