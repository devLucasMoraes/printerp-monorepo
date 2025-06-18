import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src'],
  splitting: false,
  sourcemap: true,
  minify: true,
  clean: true,
  noExternal: ['@printerp/auth', '@printerp/env'],
})
