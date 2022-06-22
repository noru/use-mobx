/* eslint-disable */
module.exports = {
  entryPoints: [
    './src/index.ts',
    './src/useObservable.ts',
    './src/useMultiObservable.ts',
    './src/useAutorun.ts',
    './src/useReaction.ts',
    './src/useWatch.ts',
    './src/useWhen.ts',
    './src/select.ts',
  ],
  out: 'docs',
  sort: ['required-first'],
  categoryOrder: ['Hooks', 'Helpers'],
  defaultCategory: 'Hooks',
  categorizeByGroup: false,
};
