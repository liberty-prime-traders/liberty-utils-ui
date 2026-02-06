#!/bin/bash
ng build --configuration development
docker build --platform linux/arm64 -t liberty-utils-ui .
docker tag liberty-utils-ui ezraorina834/liberty-utils-ui:dev
docker push ezraorina834/liberty-utils-ui:dev
