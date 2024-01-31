import { Environment } from 'vitest';

export default <Environment>{
  name: 'prisma',
  async setup() {
    console.log('Setting up prisma environment');

    return {
      async teardown() {
        console.log('Tearing down prisma environment');
      },
    };
  },
  transformMode: 'ssr',
};
