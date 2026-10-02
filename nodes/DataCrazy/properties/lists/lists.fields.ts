import { INodeProperties } from 'n8n-workflow';

export const listsFields: INodeProperties[] = [
	// Campo ID da Lista - usado para get, update e delete
	{
		displayName: 'ID da Lista',
		name: 'listId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lists'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'ID único da lista',
	},

	// Campo Nome - obrigatório para create
	{
		displayName: 'Nome',
		name: 'listName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lists'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Nome da lista',
	},

	// Campos adicionais para create e update
	{
		displayName: 'Campos Adicionais',
		name: 'listAdditionalFields',
		type: 'collection',
		placeholder: 'Adicionar Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['lists'],
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
				description: 'Nome da lista',
			},
			{
				displayName: 'Descrição',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Descrição da lista',
			},
		],
	},

	// Opções de busca para getAll
	{
		displayName: 'Opções de Busca',
		name: 'listOptions',
		type: 'collection',
		placeholder: 'Adicionar Opção',
		default: {},
		displayOptions: {
			show: {
				resource: ['lists'],
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
				description: 'Número máximo de listas para retornar (máximo 100)',
			},
			{
				displayName: 'Buscar',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Termo de busca para filtrar listas',
			},
		],
	},
];
