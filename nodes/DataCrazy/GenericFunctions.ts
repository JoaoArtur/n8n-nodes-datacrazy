import { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';

export async function request(
	context: IExecuteFunctions,
	method: string,
	endpoint: string,
	body?: any,
	queryParams?: any,
	baseUrl?: string,
): Promise<any> {
	const credentials = await context.getCredentials('dataCrazyCredentials');

	let url = baseUrl || `https://api.datacrazy.io/v1/api/api/v1`;
	url += endpoint;

	// Add query parameters if provided
	if (queryParams && Object.keys(queryParams).length > 0) {
		const searchParams = new URLSearchParams();
		Object.keys(queryParams).forEach((key) => {
			const value = queryParams[key];
			if (value !== undefined && value !== null) {
				// Tratar objetos aninhados (como filter[all]=true)
				if (typeof value === 'object' && !Array.isArray(value)) {
					Object.keys(value).forEach((nestedKey) => {
						const nestedValue = value[nestedKey];
						if (nestedValue !== undefined && nestedValue !== null) {
							searchParams.append(`${key}[${nestedKey}]`, nestedValue.toString());
						}
					});
				} else {
					searchParams.append(key, value.toString());
				}
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

export async function requestForLoadOptions(
	context: ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body?: any,
	queryParams?: any,
	baseUrl?: string,
): Promise<any> {
	const credentials = await context.getCredentials('dataCrazyCredentials');

	let url = baseUrl || `https://api.datacrazy.io/v1/api/api/v1`;
	url += endpoint;

	// Add query parameters if provided
	if (queryParams && Object.keys(queryParams).length > 0) {
		const searchParams = new URLSearchParams();
		Object.keys(queryParams).forEach((key) => {
			const value = queryParams[key];
			if (value !== undefined && value !== null) {
				// Tratar objetos aninhados (como filter[all]=true)
				if (typeof value === 'object' && !Array.isArray(value)) {
					Object.keys(value).forEach((nestedKey) => {
						const nestedValue = value[nestedKey];
						if (nestedValue !== undefined && nestedValue !== null) {
							searchParams.append(`${key}[${nestedKey}]`, nestedValue.toString());
						}
					});
				} else {
					searchParams.append(key, value.toString());
				}
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
