#!/usr/bin/env bash -xe
if [[ -z "$1" ]]; then
    echo "argument error"
    exit 2
fi

echo $1

aws --region us-east-1 s3 rm --recursive s3://cdn.atom-data.io/js/session/$1/
aws --region us-east-1 s3 cp dist/ s3://cdn.atom-data.io/js/session/$1/ --recursive --acl public-read
aws cloudfront create-invalidation --distribution-id EETANK4D76IR0 --paths /session/$1/*

aws --region us-east-1 s3 rm --recursive s3://cdn.atom-data.io/js/session/latest/
aws --region us-east-1 s3 cp dist/ s3://cdn.atom-data.io/js/session/latest/ --recursive --acl public-read
aws cloudfront create-invalidation --distribution-id EETANK4D76IR0 --paths /session/latest/*