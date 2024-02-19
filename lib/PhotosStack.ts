import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3'; // These are the libraries that are imported
import { Construct } from 'constructs';
import { Fn } from 'aws-cdk-lib'; // To import intrinsic functions

export class PhotosStack extends cdk.Stack {

    private stackSuffix: string;
    public readonly photosBucketArn: string;

    // Note that the ? after the props parameter says that it is optional
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      this.initStackSuffix();

      // Create the bucket
      const photosBucket = new Bucket(this, 'PhotosStack', { // Construct ID
        // PAY ATTENTION to using the tics ` here NOT quotes '
        bucketName: `photosbucket-${this.stackSuffix}`, // specifies the Logical ID
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });

      // Assign the bucket ARN to data member photosBucketArn
      this.photosBucketArn = photosBucket.bucketArn;

      // This is useful to fix the Logical ID that IDs the physical resource in the stack
      // This allows us to change the Construct ID if needed with triggering a change in the logical ID
      // which results in a failure to update the stack because of duplicate physical IDs
      (photosBucket.node.defaultChild as cdk.aws_s3.CfnBucket).overrideLogicalId('PhotosStackNew');
    }

    private initStackSuffix(){
        const shortStackId = Fn.select(2, Fn.split('/', this.stackId)) // brings the part from the stackId after the last '/'
        this.stackSuffix = Fn.select(4, Fn.split('-', shortStackId))
    }
}