import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3'; // These are the libraries that are imported
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

// Defining a level 3 construct MUST inherit from Construct
// Once you define this class you can later instantiate objects from it
class L3Bucket extends Construct {
  // First thing we define a constructor
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id); // Calling the constructor of the super class

    // Defining what happens in the constructor
    // We are defining a new Bucket with a default expiration period of 2 days
    new Bucket(this, 'OMK_L3_Bucket', {
      lifecycleRules: [{
        expiration: cdk.Duration.days(expiration)
      }],
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }
}

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // We need to instantiate a parameter to be able to use it
    const duration = new cdk.CfnParameter(this, 'duration', {
      default: 6,
      minValue: 1,
      maxValue: 10,
      type: 'Number' // Note the capital N
    });

    //create S3 bucket in 3 ways:
    // Using Level 2 constructs
    const myL2Bucket = new Bucket(this, 'OMK_L2_Bucket', {
      lifecycleRules: [{
        expiration: cdk.Duration.days(duration.valueAsNumber)
      }],
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Here we just defined a CDK output to print the name of the deplyed L2 bucket
    new cdk.CfnOutput(this, 'MyL2BucketName', {
      value: myL2Bucket.bucketName
    });

    // Using Level 1 constructs
    // Note how we needed to specify that the expiration is enabled
    // Compare to Layer 2 above, you can see that lvl 2 is more convenient
    // Because expiration is implied to be enabled
    new CfnBucket(this, 'OMK_L1_Bucket', {
      lifecycleConfiguration: {
        rules: [{
          expirationInDays: 2,
          status: 'Enabled'
        }]
      }
    });

    // In contrast if you encapsulate your definitions in a class
    // We refer to this as layer 3 construct since it encapsulates layer 2
    // you can simply accomplish the same by:
    new L3Bucket(this, 'OMK_L3_Bucket', 2);



  }
}
