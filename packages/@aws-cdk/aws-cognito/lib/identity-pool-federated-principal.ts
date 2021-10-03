import { FederatedPrincipal } from '@aws-cdk/aws-iam';
import { IIdentityPool } from './identity-pool';

/**
 * Props for the Identity Pool Federated Principal
 */
export interface IdentityPoolFederatedPrincipalProps {
  /**
   * The identity pool for the federated principal
   */
  identityPool: IIdentityPool

  /**
   * The url of the authentica
   */
  providerUrl?: string
  conditions?: ConditionOptions[]
  assumeRoleAction?: string
  identityPoolConditionOptions?: Omit<ConditionOptions, 'conditionValue'>
}

export interface ConditionOptions {
  claim: string
  conditionValue?: any
  conditionType?: StringConditionOperator
}

export class StringConditionOperator {
  public static readonly EQUALS = new StringConditionOperator('StringEquals');
  public static readonly NOT_EQUALS = new StringConditionOperator('StringNotEquals');
  public static readonly EQUALS_IGNORE_CASE = new StringConditionOperator('StringEqualsIgnoreCase');
  public static readonly NOT_EQUALS_IGNORE_CASE = new StringConditionOperator('StringNotEqualsIgnoreCase');
  public static readonly LIKE = new StringConditionOperator('StringLike');
  public static readonly NOT_LIKE = new StringConditionOperator('StringNotLike');

  private constructor(public readonly value: string) {}

  public forAnyValue(): StringConditionOperator {
    return new StringConditionOperator(`ForAnyValue:${this.value}`);
  }

  public forAllValues(): StringConditionOperator {
    return new StringConditionOperator(`ForAllValues:${this.value}`);
  }
}

export class IdentityPoolFederatedPrincipal extends FederatedPrincipal {
  
  constructor(props: IdentityPoolFederatedPrincipalProps) {
    super(
      props.providerUrl || 'cognito-identity.amazonaws.com',
      {},
      props.assumeRoleAction || 'sts:AssumeRoleWithWebIdentity',
    );
    const conditions = [
      ...props.conditions,
      {
        claim: 'aud',
        conditionType: StringConditionOperator.EQUALS,
        ...(props.identityPoolConditionOptions || {}),
        conditionValue: props.identityPool.identityPoolId,
      }
    ]
    this.addConditions(...conditions);
  }

  public static authenticated(props?: IdentityPoolFederatedPrincipalProps): IdentityPoolFederatedPrincipal {
    return (new IdentityPoolFederatedPrincipal(props)).addConditions({
      claim: 'amr',
      conditionType: StringConditionOperator.LIKE.forAnyValue(),
      conditionValue: 'authenticated',
    });
  }

  public static unauthenticated(props?: IdentityPoolFederatedPrincipalProps): IdentityPoolFederatedPrincipal {
    return (new IdentityPoolFederatedPrincipal(props)).addConditions({
      claim: 'amr',
      conditionType: StringConditionOperator.LIKE.forAnyValue(),
      conditionValue: 'unauthenticated',
    });
  }

  public addConditions(...options: ConditionOptions[]): this {
    options.forEach(option => this.addCondition(option), this);
    return this;
  }

  private claim(claim: string): string {
    return `${this.federated}:${claim}`
  }

  private addCondition(options: ConditionOptions): this {
    const conditionType = options.conditionType || StringConditionOperator.EQUALS;
    this.conditions[conditionType.value] = {
      [this.claim(options.claim)]: options.conditionValue
    }
    return this;
  }
}