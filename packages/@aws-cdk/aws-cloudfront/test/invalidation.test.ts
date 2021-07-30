import '@aws-cdk/assert-internal/jest';
import { App, Stack } from '@aws-cdk/core';
import { Invalidation } from '../lib/private/invalidation';

describe('Invalidation', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
  });

  test('minimal example', () => {
    new Invalidation(stack, 'MyInvalidation', {
      distributionId: '12345',
    });

    expect(stack).toMatchTemplate({
      Resources: {
        MyInvalidationInvalidationResourceCustomResourcePolicy7FD8E2A7: {
          Type: 'AWS::IAM::Policy',
          Properties: {
            PolicyDocument: {
              Statement: [
                {
                  Action: 'cloudfront:CreateInvalidation',
                  Effect: 'Allow',
                  Resource: '*',
                },
              ],
              Version: '2012-10-17',
            },
            PolicyName: 'MyInvalidationInvalidationResourceCustomResourcePolicy7FD8E2A7',
            Roles: [
              {
                Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
              },
            ],
          },
        },
        MyInvalidationInvalidationResourceED69EFC0: {
          Type: 'Custom::CloudFrontInvalidation',
          Properties: {
            ServiceToken: {
              'Fn::GetAtt': [
                'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
                'Arn',
              ],
            },
            Create: '{\"service\":\"CloudFront\",\"action\":\"createInvalidation\",\"physicalResourceId\":{\"responsePath\":\"Invalidation.Id\"},\"parameters\":{\"DistributionId\":\"12345\",\"InvalidationBatch\":{\"CallerReference\":\"StackMyInvalidation0\",\"Paths\":{\"Quantity\":1,\"Items\":[\"/*\"]}}}}',
            Update: '{\"service\":\"CloudFront\",\"action\":\"createInvalidation\",\"physicalResourceId\":{\"responsePath\":\"Invalidation.Id\"},\"parameters\":{\"DistributionId\":\"12345\",\"InvalidationBatch\":{\"CallerReference\":\"StackMyInvalidation0\",\"Paths\":{\"Quantity\":1,\"Items\":[\"/*\"]}}}}',
            InstallLatestAwsSdk: true,
          },
          DependsOn: [
            'MyInvalidationInvalidationResourceCustomResourcePolicy7FD8E2A7',
          ],
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
        AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'lambda.amazonaws.com',
                  },
                },
              ],
              Version: '2012-10-17',
            },
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                  ],
                ],
              },
            ],
          },
        },
        AWS679f53fac002430cb0da5b7982bd22872D164C4C: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: {
                Ref: 'AssetParameters5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4S3BucketB17E5ABD',
              },
              S3Key: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::Select': [
                        0,
                        {
                          'Fn::Split': [
                            '||',
                            {
                              Ref: 'AssetParameters5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4S3VersionKey77778F6A',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      'Fn::Select': [
                        1,
                        {
                          'Fn::Split': [
                            '||',
                            {
                              Ref: 'AssetParameters5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4S3VersionKey77778F6A',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                ],
              },
            },
            Role: {
              'Fn::GetAtt': [
                'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
                'Arn',
              ],
            },
            Handler: 'index.handler',
            Runtime: 'nodejs12.x',
            Timeout: 120,
          },
          DependsOn: [
            'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
          ],
        },
      },
      Parameters: {
        AssetParameters5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4S3BucketB17E5ABD: {
          Type: 'String',
          Description: 'S3 bucket for asset \"5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4\"',
        },
        AssetParameters5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4S3VersionKey77778F6A: {
          Type: 'String',
          Description: 'S3 key for asset version \"5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4\"',
        },
        AssetParameters5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4ArtifactHash580E429C: {
          Type: 'String',
          Description: 'Artifact hash for asset \"5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4\"',
        },
      },
    });
  });
  test('maximum example', () => {
    new Invalidation(stack, 'MyInvalidation', {
      distributionId: '12345',
      invalidationName: 'MyInvalidationName',
      invalidationPaths: ['/example1', '/example2/*', '/example3/index.html'],
    });
    expect(stack).toMatchTemplate({
      Resources: {
        MyInvalidationInvalidationResourceCustomResourcePolicy7FD8E2A7: {
          Type: 'AWS::IAM::Policy',
          Properties: {
            PolicyDocument: {
              Statement: [
                {
                  Action: 'cloudfront:CreateInvalidation',
                  Effect: 'Allow',
                  Resource: '*',
                },
              ],
              Version: '2012-10-17',
            },
            PolicyName: 'MyInvalidationInvalidationResourceCustomResourcePolicy7FD8E2A7',
            Roles: [
              {
                Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
              },
            ],
          },
        },
        MyInvalidationInvalidationResourceED69EFC0: {
          Type: 'Custom::CloudFrontInvalidation',
          Properties: {
            ServiceToken: {
              'Fn::GetAtt': [
                'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
                'Arn',
              ],
            },
            Create: '{\"service\":\"CloudFront\",\"action\":\"createInvalidation\",\"physicalResourceId\":{\"responsePath\":\"Invalidation.Id\"},\"parameters\":{\"DistributionId\":\"12345\",\"InvalidationBatch\":{\"CallerReference\":\"StackMyInvalidation0\",\"Paths\":{\"Quantity\":3,\"Items\":[\"/example1\",\"/example2/*\",\"/example3/index.html\"]}}}}',
            Update: '{\"service\":\"CloudFront\",\"action\":\"createInvalidation\",\"physicalResourceId\":{\"responsePath\":\"Invalidation.Id\"},\"parameters\":{\"DistributionId\":\"12345\",\"InvalidationBatch\":{\"CallerReference\":\"StackMyInvalidation0\",\"Paths\":{\"Quantity\":3,\"Items\":[\"/example1\",\"/example2/*\",\"/example3/index.html\"]}}}}',
            InstallLatestAwsSdk: true,
          },
          DependsOn: [
            'MyInvalidationInvalidationResourceCustomResourcePolicy7FD8E2A7',
          ],
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
        AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'lambda.amazonaws.com',
                  },
                },
              ],
              Version: '2012-10-17',
            },
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                  ],
                ],
              },
            ],
          },
        },
        AWS679f53fac002430cb0da5b7982bd22872D164C4C: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: {
                Ref: 'AssetParameters5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4S3BucketB17E5ABD',
              },
              S3Key: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::Select': [
                        0,
                        {
                          'Fn::Split': [
                            '||',
                            {
                              Ref: 'AssetParameters5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4S3VersionKey77778F6A',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      'Fn::Select': [
                        1,
                        {
                          'Fn::Split': [
                            '||',
                            {
                              Ref: 'AssetParameters5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4S3VersionKey77778F6A',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                ],
              },
            },
            Role: {
              'Fn::GetAtt': [
                'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
                'Arn',
              ],
            },
            Handler: 'index.handler',
            Runtime: 'nodejs12.x',
            Timeout: 120,
          },
          DependsOn: [
            'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
          ],
        },
      },
      Parameters: {
        AssetParameters5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4S3BucketB17E5ABD: {
          Type: 'String',
          Description: 'S3 bucket for asset \"5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4\"',
        },
        AssetParameters5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4S3VersionKey77778F6A: {
          Type: 'String',
          Description: 'S3 key for asset version \"5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4\"',
        },
        AssetParameters5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4ArtifactHash580E429C: {
          Type: 'String',
          Description: 'Artifact hash for asset \"5c61041c12314e1ad8e67a0107fa3733382a206a78cdc1576fffa7e93caca5b4\"',
        },
      },
    });
  });
});