import '@aws-cdk/assert-internal/jest';
import { expect as expectStack } from '@aws-cdk/assert-internal';
import { App, Stack } from '@aws-cdk/core';
import { Distribution, Invalidation } from '../lib';
import { defaultOrigin, defaultOriginGroup } from './test-origin';

describe('KeyGroup', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
  });

  test('minimal example', () => {
    const origin = defaultOrigin();
    const distribution = new Distribution(stack, 'MyDist', { defaultBehavior: { origin } });
    new Invalidation(stack, 'MyInvalidation', {
      distributionId: distribution.distributionId
    });

    expectStack(stack).toMatch({
      Resources: {
        MyInvalidation94313T2P: {
          Type: 'AWS::CloudFront::Invalidation',
          Properties: {

          },
        },
        MyInvalidationOD47CN17: {
          Type: 'AWS::CloudFront::Invalidation',
          Properties: {

          },
        },
      },
    });
  });

 /* test('maximum example', () => {
    new KeyGroup(stack, 'MyKeyGroup', {
      keyGroupName: 'AcmeKeyGroup',
      comment: 'Key group created on 1/1/1984',
      items: [
        new PublicKey(stack, 'MyPublicKey', {
          publicKeyName: 'pub-key',
          encodedKey: publicKey1,
          comment: 'Key expiring on 1/1/1984',
        }),
      ],
    });

    expectStack(stack).toMatch({
      Resources: {
        MyPublicKey78071F3D: {
          Type: 'AWS::CloudFront::PublicKey',
          Properties: {
            PublicKeyConfig: {
              CallerReference: 'c872d91ae0d2943aad25d4b31f1304d0a62c658ace',
              EncodedKey: publicKey1,
              Name: 'pub-key',
              Comment: 'Key expiring on 1/1/1984',
            },
          },
        },
        MyKeyGroupAF22FD35: {
          Type: 'AWS::CloudFront::KeyGroup',
          Properties: {
            KeyGroupConfig: {
              Items: [
                {
                  Ref: 'MyPublicKey78071F3D',
                },
              ],
              Name: 'AcmeKeyGroup',
              Comment: 'Key group created on 1/1/1984',
            },
          },
        },
      },
    });
  });

  test('multiple keys example', () => {
    new KeyGroup(stack, 'MyKeyGroup', {
      keyGroupName: 'AcmeKeyGroup',
      comment: 'Key group created on 1/1/1984',
      items: [
        new PublicKey(stack, 'BingoKey', {
          publicKeyName: 'Bingo-Key',
          encodedKey: publicKey1,
          comment: 'Key expiring on 1/1/1984',
        }),
        new PublicKey(stack, 'RollyKey', {
          publicKeyName: 'Rolly-Key',
          encodedKey: publicKey2,
          comment: 'Key expiring on 1/1/1984',
        }),
      ],
    });

    expectStack(stack).toMatch({
      Resources: {
        BingoKeyCBEC786C: {
          Type: 'AWS::CloudFront::PublicKey',
          Properties: {
            PublicKeyConfig: {
              CallerReference: 'c847cb3dc23f619c0a1e400a44afaf1060d27a1d1a',
              EncodedKey: publicKey1,
              Name: 'Bingo-Key',
              Comment: 'Key expiring on 1/1/1984',
            },
          },
        },
        RollyKey83F8BC5B: {
          Type: 'AWS::CloudFront::PublicKey',
          Properties: {
            PublicKeyConfig: {
              CallerReference: 'c83a16945c386bf6cd88a3aaa1aa603eeb4b6c6c57',
              EncodedKey: publicKey2,
              Name: 'Rolly-Key',
              Comment: 'Key expiring on 1/1/1984',
            },
          },
        },
        MyKeyGroupAF22FD35: {
          Type: 'AWS::CloudFront::KeyGroup',
          Properties: {
            KeyGroupConfig: {
              Items: [
                {
                  Ref: 'BingoKeyCBEC786C',
                },
                {
                  Ref: 'RollyKey83F8BC5B',
                },
              ],
              Name: 'AcmeKeyGroup',
              Comment: 'Key group created on 1/1/1984',
            },
          },
        },
      },
    });
  });*/
});