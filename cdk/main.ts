import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";

import { Function } from "./function";

interface StackConfig {
  environment: string;
  region: string;
  roles: { [key: string]: string }
}

class Stack extends TerraformStack {
  constructor(scope: Construct, id: string, config: StackConfig) {
    super(scope, id);

    new AwsProvider(this, "AWS", {
      region: config.region
    });

    new Function(this, 'function-a', config.region, config.environment, config.roles['function-a'], '../function-a');
    new Function(this, 'function-b', config.region, config.environment, config.roles['function-b'], '../function-b');
  }
}

const app = new App();
new Stack(app, "api-dev", {
  environment: 'dev',
  region: 'us-west-2',
  roles: {
    'function-a': '[role arn here]',
    'function-b': '[role arn here]'
  }
});
new Stack(app, "api-prod-uswest2", {
  environment: 'prod',
  region: 'us-west-2',
  roles: {
    'function-a': '[role arn here]',
    'function-b': '[role arn here]'
  }
});
new Stack(app, "api-prod-useast1", {
  environment: 'prod',
  region: 'us-east-1',
  roles: {
    'function-a': '[role arn here]',
    'function-b': '[role arn here]'
  }
});
app.synth();
