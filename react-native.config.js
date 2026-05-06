/**
 * Drops `assets/fonts/*.ttf|otf` into native projects (`npx react-native-asset`).
 * Optional Inter: add e.g. `Inter-Regular.ttf` / `Inter-SemiBold.ttf` here — then map
 * `fontFamilyPrimary` in `src/theme/typography.ts`.
 */
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
};
