#!/bin/bash
ng build --configuration test
docker build --platform linux/arm64 -t liberty-utils-ui .
docker tag liberty-utils-ui ezraorina834/liberty-utils-ui:test
docker push ezraorina834/liberty-utils-ui:test
