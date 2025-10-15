import { INodeProperties } from 'n8n-workflow';

const additionalFieldsFields: INodeProperties[] = [
	// Campo para selecionar o escopo (Lead ou Deal) - usado em ambas operações
	{
		displayName: 'Escopo',
		name: 'scope',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['additionalFields'],
			},
		},
		options: [
			{
				name: 'Lead',
				value: 'lead',
				description: 'Campos adicionais de leads',
			},
			{
				name: 'Negócio',
				value: 'deal',
				description: 'Campos adicionais de negócios',
			},
		],
		default: 'lead',
		description: 'Selecione se deseja trabalhar com campos de leads ou negócios',
	},

	// Campos específicos para a operação setValue
	{
		displayName: 'ID do Lead',
		name: 'leadId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['additionalFields'],
				operation: ['setValue'],
				scope: ['lead'],
			},
		},
		default: '',
		description: 'ID do lead para definir o campo adicional',
	},

	{
		displayName: 'ID do Negócio',
		name: 'dealId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['additionalFields'],
				operation: ['setValue'],
				scope: ['deal'],
			},
		},
		default: '',
		description: 'ID do negócio para definir o campo adicional',
	},

	{
		displayName: 'Campo Adicional',
		name: 'additionalFieldId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAdditionalFields',
			loadOptionsDependsOn: ['scope'],
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['additionalFields'],
				operation: ['setValue'],
			},
		},
		default: '',
		description: 'Selecione o campo adicional que deseja definir',
	},

	{
		displayName: 'Valor',
		name: 'value',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['additionalFields'],
				operation: ['setValue'],
			},
		},
		default: '',
		description: 'Valor a ser definido para o campo adicional',
	},

	// Opções para a operação getAll
	{
		displayName: 'Opções',
		name: 'options',
		type: 'collection',
		placeholder: 'Adicionar Opção',
		displayOptions: {
			show: {
				resource: ['additionalFields'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Pular',
				name: 'skip',
				type: 'number',
				default: 0,
				description: 'Número de registros para pular',
			},
			{
				displayName: 'Limite',
				name: 'take',
				type: 'number',
				default: 500,
				description: 'Número máximo de registros para retornar',
			},
		],
	},
];

export default additionalFieldsFields;