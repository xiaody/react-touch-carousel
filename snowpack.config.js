// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    examples: '/',
    src: '/src'
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    port: 2002
  },
  buildOptions: {
    out: 'docs'
  },
  optimize: {
    treeshake: true
  }
}
