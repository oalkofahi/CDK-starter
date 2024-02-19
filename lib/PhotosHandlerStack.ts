import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3'; // These are the libraries that are imported
import { Construct } from 'constructs';
import { Fn } from 'aws-cdk-lib'; // To import intrinsic functions
import {Code, Function as LambdaFunction, Runtime} from 'aws-cdk-lib/aws-lambda'

// Customize the Stack properties interface to include the target bucket ARN
interface PhotosHandlerStackProps extends cdk.StackProps {
  targetBucketArn: string
}

export class PhotosHandlerStack extends cdk.Stack {

    // The properties are not optional anymore because we have a dependency on the external bucket
    constructor(scope: Construct, id: string, props: PhotosHandlerStackProps) {
      super(scope, id, props);

      // Code usually should be in a separate file, but here we are using inline code because it is simple
      new LambdaFunction(this, 'PhotosHandler', {
        runtime: Runtime.NODEJS_16_X,
        handler: 'index.handler',
        code: Code.fromInline(`
        exports.handler = async (event) => {
          console.log("hello!: " + process.env.TARGET_BUCKET)
        };
        `),
        environment: {
          TARGET_BUCKET: props.targetBucketArn,
        },

      });

    }
}