import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ResponseStream } from './ResponseStream.js';

declare const awslambda: any;

const textEncoder = new TextEncoder();

export const handler = awslambda.streamifyResponse(async (
    _: APIGatewayProxyEventV2,
    responseStream: ResponseStream
) => {
    await textResponse(responseStream, 200, 'This is Function A.');
});

async function textResponse(responseStream: ResponseStream, statusCode: number, text: string) {
    const httpResponseMetadata = {
        statusCode,
        headers: {
            "Content-Type": "text/plain",
        }
    };

    responseStream = awslambda.HttpResponseStream.from(responseStream, httpResponseMetadata);
    await responseStream.write(text);
    responseStream.end();
}