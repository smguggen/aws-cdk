import { IResource, Names, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';
import { randomBytes } from 'crypto';
/**
 * Represents a Cloudfront Invalidation
 */
export interface IInvalidation extends IResource {
  /**
   * The ID of the invalidation.
   * @attribute
   */
  readonly invalidationId: string;

  /**
   * Id of the CloudFront Distribution to associate
   * @attribute
   */
  readonly distributionId:string;

  /**
   * A list of the paths in the distribution to invalidate 
   * @attribute
   */
  readonly invalidationPaths:string[];
}


/**
 * Attributes needed to reference a Cloudfront Invalidation
 */
 export interface InvalidationAttributes {
  /**
   * The ID of the invalidation.
   * @attribute
   */
  invalidationId: string;

  /**
   * Id of the CloudFront Distribution to associate
   * @attribute
   */
  distributionId:string;

  /**
   * A list of the paths in the distribution to invalidate 
   * @default - invalidate all paths: ['/*']
   */
  invalidationPaths?:string[];
}

/**
 * Properties for creating an Invalidation
 */
export interface InvalidationProps {
  /**
   * Id of the CloudFront Distribution to associate
   */
  readonly distributionId: string;

  /**
   * A list of the paths in the distribution to invalidate 
   * @default - invalidate all paths: ['/*']
   */
  readonly invalidationPaths?: string[];

  /**
   * A name to identify the invalidation.
   * @default - generated from the `id`
   */
  readonly invalidationName?: string;
}

/**
 * An Invalidation configuration
 *
 * @resource AWS::CloudFront::Invalidation
 */
export class Invalidation extends Resource implements IInvalidation {

  public readonly invalidationId: string;
  public readonly distributionId: string;
  public readonly invalidationPaths: string[];

  private invalidationName: string

  constructor(scope: Construct, id: string, props: InvalidationProps) {
    super(scope, id);

    this.distributionId = props.distributionId;
    this.invalidationName = props.invalidationName || id;
    this.invalidationPaths = props.invalidationPaths && props.invalidationPaths.length ? props.invalidationPaths : ['/*'];

    const resource = new AwsCustomResource(this, 'InvalidationResource', {
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE
      }),
      installLatestAwsSdk: true,
      resourceType: 'AWS::CloudFront::Invalidation',
      onUpdate: {
        service: 'CloudFront',
        action: 'createInvalidation',
        physicalResourceId: PhysicalResourceId.fromResponse('Invalidation.Id'),
        parameters: {
          DistributionId: props.distributionId,
          InvalidationBatch: {
            CallerReference: this.invalidationName + randomBytes(5).toString('hex'),
            Paths: {
              Quantity: this.invalidationPaths.length,
              Items: this.invalidationPaths
            }
          }
        }
      }
    });

    this.invalidationId = resource.getResponseField('Invalidation.Id');
  }
}
