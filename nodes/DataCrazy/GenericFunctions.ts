import { IExecuteFunctions } from 'n8n-workflow';

export async function request(
	context: IExecuteFunctions,
	method: string,
	endpoint: string,
	body?: any,
	queryParams?: any,
): Promise<any> {
	const credentials = await context.getCredentials('dataCrazyCredentials');

	let url = `https://api.datacrazy.io/v1/api/api/v1${endpoint}`;

	// Add query parameters if provided
	if (queryParams && Object.keys(queryParams).length > 0) {
		const searchParams = new URLSearchParams();
		Object.keys(queryParams).forEach((key) => {
			if (queryParams[key] !== undefined && queryParams[key] !== null) {
				searchParams.append(key, queryParams[key].toString());
			}
		});
		url += `?${searchParams.toString()}`;
	}

	const options: any = {
		method,
		url,
		headers: {
			Authorization: 'Bearer ' + credentials.apiKey,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (body) {
		options.body = body;
	}

	return await context.helpers.request(options);
}
