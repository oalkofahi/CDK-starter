#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStarterStack } from '../lib/cdk-starter-stack';
import { PhotosStack } from '../lib/PhotosStack';
import { PhotosHandlerStack } from '../lib/PhotosHandlerStack';
import { BucketTagger } from './Tagger';

const app = new cdk.App();
// Create a reference to the PhotosStack object because we need it to provide access to the bucket
const photosStack = new PhotosStack(app, 'OMKPhotosStack');

// Use the refernece created above to pass the required property
new PhotosHandlerStack(app, 'OMKPhotosHandlerStack', {
    targetBucketArn: photosStack.photosBucketArn
});

const tagger = new BucketTagger('level', 'test');

cdk.Aspects.of(app).add(tagger);