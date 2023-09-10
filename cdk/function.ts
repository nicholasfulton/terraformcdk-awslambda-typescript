import { LambdaFunction } from "@cdktf/provider-aws/lib/lambda-function"; 
import { LambdaFunctionUrl } from "@cdktf/provider-aws/lib/lambda-function-url";
import { AssetType, TerraformAsset } from "cdktf";
import { execSync } from "child_process";
import { Construct } from "constructs";
import { join } from 'path';

export class Function extends Construct {
    public function: LambdaFunction;
    public functionCode: TerraformAsset;
    public functionUrl: LambdaFunctionUrl;

    constructor(
        scope: Construct,
        id: string,
        region: string,
        environment: string,
        executionRoleArn: string,
        sourcePath: string) {
        super(scope, id);

        // Build submit form
        execSync(`cd "${join(module.path, sourcePath)}" && npm run build`);

        let functionName = `${id}-${environment}-${region.replace(/-/g, '')}`;

        this.functionCode = new TerraformAsset(this, `${functionName}-code`, {
            path: join(module.path, sourcePath, 'dist/deploy.zip'),
            type: AssetType.FILE
        });

        this.function = new LambdaFunction(this, functionName, {
            functionName,
            role: executionRoleArn,
            filename: this.functionCode.path,
            sourceCodeHash: this.functionCode.assetHash,
            handler: 'index.handler',
            architectures: ['arm64'],
            runtime: 'nodejs18.x',
        });

        this.functionUrl = new LambdaFunctionUrl(this, `${functionName}-url`, {
            functionName: this.function.arn,
            authorizationType: 'NONE',
            invokeMode: 'RESPONSE_STREAM'
        });
    }
}