import { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';

const API_HOST = 'https://api.g1.datacrazy.io';

export async function request(
	context: IExecuteFunctions,
	method: string,
	endpoint: string,
	body?: any,
	queryParams?: any,
	baseUrl?: string,
): Promise<any> {
	const credentials = await context.getCredentials('dataCrazyCredentials');

	let url = baseUrl || `${API_HOST}/api/v1`;
	url += endpoint;

	// Add query parameters if provided
	if (queryParams && Object.keys(queryParams).length > 0) {
		const searchParams = new URLSearchParams();

		Object.keys(queryParams).forEach((key) => {
			const value = queryParams[key];

			if (value !== undefined && value !== null) {
				// Tratar objetos aninhados (como filter[campo]=valor)
				if (typeof value === 'object' && !Array.isArray(value)) {
					Object.keys(value).forEach((nestedKey) => {
						const nestedValue = value[nestedKey];
						if (nestedValue !== undefined && nestedValue !== null) {
							const paramName = `${key}[${nestedKey}]`;
							searchParams.append(paramName, nestedValue.toString());
						}
					});
				} else {
					searchParams.append(key, value.toString());
				}
			}
		});

		const queryString = searchParams.toString();
		url += `?${queryString}`;
	}

	console.log('🚀 [DEBUG] URL final da requisição:', url);

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

	const response = await context.helpers.request(options);

	return response;
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

	let url = baseUrl || `${API_HOST}/api/v1`;
	url += endpoint;

	// Add query parameters if provided
	if (queryParams && Object.keys(queryParams).length > 0) {
		const searchParams = new URLSearchParams();
		Object.keys(queryParams).forEach((key) => {
			const value = queryParams[key];
			if (value !== undefined && value !== null) {
				// Tratar objetos aninhados (como filter[campo]=valor)
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
