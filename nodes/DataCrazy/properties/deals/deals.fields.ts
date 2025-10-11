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
		required: false,
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
				displayName: 'Pular',
				name: 'skip',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Número de registros para pular (paginação)',
			},
			{
				displayName: 'Quantidade',
				name: 'take',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				default: 50,
				description: 'Número máximo de negócios para retornar',
			},
			{
				displayName: 'Buscar',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Termo de busca para filtrar negócios',
			},
			{
				displayName: 'Filtros Avançados',
				name: 'filter',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						name: 'filterOptions',
						displayName: 'Opções de Filtro',
						values: [
							{
								displayName: 'Motivo de Perda',
								name: 'lossReason',
								type: 'string',
								default: '',
								description: 'ID de motivo de perda. Ex: "59e77f5f-7581-4f20-a05b-97cd33485019"',
							},
							{
								displayName: 'Tags',
								name: 'tags',
								type: 'string',
								default: '',
								description: 'ID ou lista de IDs de tags. Formato: <operação> <id1>,<id2>. Operações: some, every, none. Ex: "every 849fefab-e697-4720-9303-e788c23790cc,9e008d34-86d2-49fd-90af-34a9f9b29896"',
							},
							{
								displayName: 'Produtos',
								name: 'products',
								type: 'string',
								default: '',
								description: 'ID ou lista de IDs de produtos. Formato: <operação> <id1>,<id2>. Operações: some, every, none. Ex: "none 849fefab-e697-4720-9303-e788c23790cc"',
							},
							{
								displayName: 'Atendentes',
								name: 'attendants',
								type: 'string',
								default: '',
								description: 'ID ou lista de IDs de atendentes separados por vírgula. Ex: "9e008d34-86d2-49fd-90af-34a9f9b29896"',
							},
							{
								displayName: 'Campos do Lead',
								name: 'fields',
								type: 'string',
								default: '',
								description: 'Expressões de filtro em campos adicionais do lead. Formato: <idDoCampo> <operação> <valorDoCampo>. Operações: contains, eq, not. Ex: "6f236135-0c72-40d2-9ff5-18c983aeb02b contains texto do campo"',
							},
							{
								displayName: 'Status',
								name: 'status',
								type: 'options',
								options: [
									{
										name: 'Ganhos',
										value: 'won',
									},
									{
										name: 'Em Processo',
										value: 'in_process',
									},
									{
										name: 'Perdidos',
										value: 'lost',
									},
								],
								default: '',
								description: 'Status do negócio',
							},
							{
								displayName: 'Campos do Negócio',
								name: 'businessFields',
								type: 'string',
								default: '',
								description: 'Expressões de filtro em campos adicionais do negócio. Formato: <idDoCampo> <operação> <valorDoCampo>. Operações: contains, eq, not. Ex: "6f236135-0c72-40d2-9ff5-18c983aeb02b contains texto do campo"',
							},
							{
								displayName: 'Origem',
								name: 'source',
								type: 'string',
								default: '',
								description: 'Origem do lead. Ex: "Google Ads"',
							},
							{
								displayName: 'Valor Mínimo',
								name: 'minValue',
								type: 'number',
								typeOptions: {
									minValue: 0,
								},
								default: '',
								description: 'Valor mínimo dos negócios a serem filtrados. Ex: 12000',
							},
							{
								displayName: 'Valor Máximo',
								name: 'maxValue',
								type: 'number',
								typeOptions: {
									minValue: 0,
								},
								default: '',
								description: 'Valor máximo dos negócios a serem filtrados. Ex: 300',
							},
							{
								displayName: 'Data de Início',
								name: 'startDate',
								type: 'dateTime',
								default: '',
								description: 'Filtro de intervalo, negócios que estão em negociação ou estavam em negociação em determinado intervalo. Formato ISO 8601',
							},
							{
								displayName: 'Data de Fim',
								name: 'endDate',
								type: 'dateTime',
								default: '',
								description: 'Filtro de intervalo, negócios que estão em negociação ou estavam em negociação em determinado intervalo. Formato ISO 8601',
							},
							{
								displayName: 'Criado Após ou Em',
								name: 'createdAtGreaterOrEqual',
								type: 'dateTime',
								default: '',
								description: 'Negócios criados na data posterior (mais recentes) a informada ou na mesma data. Formato ISO 8601',
							},
							{
								displayName: 'Criado Antes ou Em',
								name: 'createdAtLessOrEqual',
								type: 'dateTime',
								default: '',
								description: 'Negócios criados na data anterior (mais antigos) a informada ou na mesma data. Formato ISO 8601',
							},
							{
								displayName: 'Movido Após',
								name: 'lastMovedAfter',
								type: 'dateTime',
								default: '',
								description: 'Negócios movidos na data posterior (mais recentes) a informada ou na mesma data. Formato ISO 8601',
							},
							{
								displayName: 'Movido Antes',
								name: 'lastMovedBefore',
								type: 'dateTime',
								default: '',
								description: 'Negócios movidos na data anterior (mais antigos) a informada ou na mesma data. Formato ISO 8601',
							},
						],
					},
				],
			},
		],
	},
];

export default dealsFields;