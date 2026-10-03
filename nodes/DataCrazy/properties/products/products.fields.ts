import { INodeProperties } from 'n8n-workflow';

export const productsFields: INodeProperties[] = [
	// Campo ID do Produto - usado para get, update e delete
	{
		displayName: 'ID do Produto',
		name: 'productId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['products'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'ID único do produto',
	},

	// Campo Nome - obrigatório para create
	{
		displayName: 'Nome',
		name: 'productName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['products'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Nome do produto',
	},

	// Campo Preço - obrigatório para create
	{
		displayName: 'Preço',
		name: 'productPrice',
		type: 'number',
		typeOptions: {
			minValue: 0,
			numberPrecision: 2,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['products'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Preço do produto',
	},

	// Campos adicionais para create e update
	{
		displayName: 'Campos Adicionais',
		name: 'productAdditionalFields',
		type: 'collection',
		placeholder: 'Adicionar Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['products'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Nome',
				name: 'name',
				type: 'string',
				displayOptions: {
					show: {
						'/operation': ['update'],
					},
				},
				default: '',
				description: 'Nome do produto',
			},
			{
				displayName: 'Preço',
				name: 'price',
				type: 'number',
				typeOptions: {
					minValue: 0,
					numberPrecision: 2,
				},
				displayOptions: {
					show: {
						'/operation': ['update'],
					},
				},
				default: 0,
				description: 'Preço do produto',
			},
			{
				displayName: 'SKU',
				name: 'id_sku',
				type: 'string',
				default: '',
				description: 'Código SKU do produto',
			},
		],
	},

	// Opções de busca para getAll
	{
		displayName: 'Opções de Busca',
		name: 'productOptions',
		type: 'collection',
		placeholder: 'Adicionar Opção',
		default: {},
		displayOptions: {
			show: {
				resource: ['products'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Pular (Skip)',
				name: 'skip',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Número de registros para pular',
			},
			{
				displayName: 'Quantidade (Take)',
				name: 'take',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				description: 'Número máximo de produtos para retornar (máximo 100)',
			},
			{
				displayName: 'Buscar',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Termo de busca para filtrar produtos',
			},
		],
	},
];
