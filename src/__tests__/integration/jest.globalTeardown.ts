import { teardownSandbox } from './utils/setup';

export default async function teardown() {
  await teardownSandbox();
}
