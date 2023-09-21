/**
 * plugins/webfontloader.js
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

export async function loadFonts() {
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */ "webfontloader");

  webFontLoader.load({
    google: {
      families: ["Roboto:400,500,600,700:cyrillic&display=swap"],
    },
  });
}
