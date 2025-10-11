import { INodeProperties } from 'n8n-workflow';

const dealsFields: INodeProperties[] = [
	// Deal ID for operations that need it
	{
		displayName: 'ID do Negócio',
		name: 'dealId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['deals'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'ID único do negócio',
	},

	// Create and Update Deal Fields
	{
		displayName: 'ID do Lead',
		name: 'leadId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['deals'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'ID do lead associado ao negócio',
	},
	{
		displayName: 'ID do Estágio',
		name: 'stageId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['deals'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'ID do estágio do funil de vendas',
	},
	{
		displayName: 'ID do Atendente',
		name: 'attendantId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['deals'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'ID do atendente responsável pelo negócio',
	},

	// Additional Fields Collection
	{
		displayName: 'Campos Adicionais',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Adicionar Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['deals'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'ID Externo',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'ID externo para integração com outros sistemas',
			},
		],
	},

	// Search Options for getAll operation
	{
		displayName: 'Opções de Busca',
		name: 'options',
		type: 'collection',
		placeholder: 'Adicionar Opção',
		default: {},
		displayOptions: {
			show: {
				resource: ['deals'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Limite',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				default: 50,
				description: 'Número máximo de negócios para retornar',
			},
			{
				displayName: 'Página',
				name: 'page',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Número da página para paginação',
			},
			{
				displayName: 'Filtrar por Lead ID',
				name: 'leadId',
				type: 'string',
				default: '',
				description: 'Filtrar negócios por ID do lead específico',
			},
			{
				displayName: 'Filtrar por Estágio ID',
				name: 'stageId',
				type: 'string',
				default: '',
				description: 'Filtrar negócios por ID do estágio específico',
			},
			{
				displayName: 'Filtrar por Atendente ID',
				name: 'attendantId',
				type: 'string',
				default: '',
				description: 'Filtrar negócios por ID do atendente específico',
			},
			{
				displayName: 'Filtrar por ID Externo',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'Filtrar negócios por ID externo específico',
			},
			{
				displayName: 'Filtrar por Data de Criação',
				name: 'createdAt',
				type: 'string',
				default: '',
				description: 'Filtrar negócios por data de criação (formato: YYYY-MM-DD)',
			},
			{
				displayName: 'Filtrar por Data de Atualização',
				name: 'updatedAt',
				type: 'string',
				default: '',
				description: 'Filtrar negócios por data de atualização (formato: YYYY-MM-DD)',
			},
		],
	},
];

export default dealsFields;