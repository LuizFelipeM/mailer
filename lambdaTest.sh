aws lambda invoke --function-name APISendEmail --invocation-type Event --cli-binary-format raw-in-base64-out --payload '{"key":"test"}' lambdaTest.json