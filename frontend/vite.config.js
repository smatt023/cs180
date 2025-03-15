import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,  // Enables `describe` and `expect` globally
    environment: 'jsdom',  // Simulates browser-like environment for React tests
    setupFiles: './src/tests/setup.js', // Ensures setup before tests
  },
})
