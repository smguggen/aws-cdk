import * as cdk from '@aws-cdk/core';
import { Invalidation } from '../lib/private/invalidation';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', {
  env: { account: '123456789012', region: 'testregion' },
});
new Invalidation(stack, 'MyInvalidation', {
  distributionId: '12345',
  invalidationName: 'MyInvalidationName',
  invalidationPaths: ['/example1', '/example2/*', '/example3/index.html'],
});

app.synth();