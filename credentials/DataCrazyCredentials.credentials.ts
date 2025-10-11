import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DataCrazyCredentials implements ICredentialType {
	name = 'dataCrazyCredentials';
	displayName = 'Credenciais DataCrazy';
	documentationUrl = 'https://api.datacrazy.io';
	properties: INodeProperties[] = [
		{
			displayName: 'Chave Da API',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Sua chave API do DataCrazy de https://api.datacrazy.io',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.datacrazy.io/v1/api/api/v1',
			url: '/leads',
			method: 'GET',
		},
	};
}