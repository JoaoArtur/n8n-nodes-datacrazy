import { INodeProperties } from 'n8n-workflow';

const leadsFields: INodeProperties[] = [
	// Lead ID for operations that need it
	{
		displayName: 'ID do Lead',
		name: 'leadId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['leads'],
				operation: ['get', 'update', 'delete', 'getActivities', 'getHistory', 'getBusinesses'],
			},
		},
		default: '',
		description: 'ID único do lead',
	},

	// Create and Update Lead Fields
	{
		displayName: 'Nome',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['leads'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Nome completo do lead',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['leads'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Endereço de email do lead',
	},
	{
		displayName: 'Telefone',
		name: 'phone',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['leads'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Número de telefone do lead',
	},
	{
		displayName: 'Empresa',
		name: 'company',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['leads'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Nome da empresa do lead',
	},
	{
		displayName: 'Origem',
		name: 'source',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['leads'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Origem do lead (ex: Google Ads, Facebook, etc.)',
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
				resource: ['leads'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Imagem',
				name: 'image',
				type: 'string',
				default: '',
				description: 'URL da imagem do lead',
			},
			{
				displayName: 'CPF/CNPJ',
				name: 'taxId',
				type: 'string',
				default: '',
				description: 'CPF ou CNPJ do lead',
			},
			{
				displayName: 'Site',
				name: 'site',
				type: 'string',
				default: '',
				description: 'Website do lead',
			},
			{
				displayName: 'Instagram',
				name: 'instagram',
				type: 'string',
				default: '',
				description: 'Perfil do Instagram do lead',
			},
			{
				displayName: 'Endereço',
				name: 'address',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						name: 'addressDetails',
						displayName: 'Detalhes do Endereço',
						values: [
							{
								displayName: 'CEP',
								name: 'zip',
								type: 'string',
								default: '',
								description: 'Código postal',
							},
							{
								displayName: 'Endereço',
								name: 'address',
								type: 'string',
								default: '',
								description: 'Logradouro',
							},
							{
								displayName: 'Bairro',
								name: 'block',
								type: 'string',
								default: '',
								description: 'Bairro',
							},
							{
								displayName: 'Cidade',
								name: 'city',
								type: 'string',
								default: '',
								description: 'Cidade',
							},
							{
								displayName: 'Estado',
								name: 'state',
								type: 'string',
								default: '',
								description: 'Estado (UF)',
							},
							{
								displayName: 'País',
								name: 'country',
								type: 'string',
								default: 'BR',
								description: 'Código do país',
							},
						],
					},
				],
			},
			{
				displayName: 'Referência da Origem',
				name: 'sourceReferral',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						name: 'sourceReferralDetails',
						displayName: 'Detalhes da Referência',
						values: [
							{
								displayName: 'ID da Origem',
								name: 'sourceId',
								type: 'string',
								default: '',
								description: 'ID único da origem',
							},
							{
								displayName: 'URL da Origem',
								name: 'sourceUrl',
								type: 'string',
								default: '',
								description: 'URL de onde o lead veio',
							},
							{
								displayName: 'ID CTWA',
								name: 'ctwaId',
								type: 'string',
								default: '',
								description: 'ID do Click to WhatsApp',
							},
						],
					},
				],
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getTags',
				},
				default: [],
				description: 'Selecione as tags para associar ao lead',
			},
			{
				displayName: 'Listas',
				name: 'lists',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'listDetails',
						displayName: 'Lista',
						values: [
							{
								displayName: 'IDs das Listas',
								name: 'id',
								type: 'string',
								default: '',
								description: 'IDs das listas separados por vírgula',
							},
						],
					},
				],
			},
			{
				displayName: 'Atendente',
				name: 'attendant',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						name: 'attendantDetails',
						displayName: 'Detalhes do Atendente',
						values: [
							{
								displayName: 'ID do Atendente',
								name: 'id',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getAttendants',
								},
								default: '',
								description: 'Selecione o atendente responsável',
							},
						],
					},
				],
			},
		],
	},

	// Query Parameters for getAll operation
	{
		displayName: 'Opções de Busca',
		name: 'options',
		type: 'collection',
		placeholder: 'Adicionar Opção',
		default: {},
		displayOptions: {
			show: {
				resource: ['leads'],
				operation: ['getAll'],
			},
		},
		options: [
			// Parâmetros básicos
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
				description: 'Número máximo de leads para retornar (máximo 100)',
			},
			{
				displayName: 'Buscar',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Termo de busca para filtrar leads',
			},
			// Opções de complete
			{
				displayName: 'Incluir Campos Adicionais',
				name: 'complete',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						name: 'completeOptions',
						displayName: 'Opções de Complete',
						values: [
							{
								displayName: 'Campos Adicionais',
								name: 'additionalFields',
								type: 'boolean',
								default: false,
								description: 'Indica se os campos adicionais devem ser incluídos na resposta',
							},
						],
					},
				],
			},
			// Filtros avançados
			{
				displayName: 'Filtros Avançados',
				name: 'filters',
				type: 'collection',
				placeholder: 'Adicionar Filtro',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						displayName: 'Tags',
						name: 'tags',
						type: 'multiOptions',
						typeOptions: {
							loadOptionsMethod: 'getTags',
						},
						default: [],
						description: 'Selecione as tags para filtrar',
					},
					{
						displayName: 'Estágios',
						name: 'stages',
						type: 'string',
						default: '',
						description: 'ID ou lista de IDs de estágios. Formato: <operação> <id1>,<id2>,<id3>. Operações: some, every, none. Ex: "none 849fefab-e697-4720-9303-e788c23790cc"',
					},
					{
						displayName: 'Data Mínima da Última Compra',
						name: 'minLastPurchaseDate',
						type: 'dateTime',
						default: '',
						description: 'Filtrar clientes que fizeram alguma compra na data especificada ou anterior. Formato ISO 8601',
					},
					{
						displayName: 'Data Máxima da Última Compra',
						name: 'maxLastPurchaseDate',
						type: 'dateTime',
						default: '',
						description: 'Filtrar clientes que fizeram alguma compra na data especificada ou posterior. Formato ISO 8601',
					},
					{
						displayName: 'Produtos nos Negócios',
						name: 'productsInBusiness',
						type: 'number',
						typeOptions: {
							minValue: 0,
						},
						default: 0,
						description: 'Quantidade de produtos que há nos negócios do lead',
					},
					{
						displayName: 'Quantidade Mínima de Negócios',
						name: 'minBusinessesCount',
						type: 'number',
						typeOptions: {
							minValue: 0,
						},
						default: 0,
						description: 'Quantidade mínima de negócios atrelados ao lead',
					},
					{
						displayName: 'Quantidade Máxima de Negócios',
						name: 'maxBusinessesCount',
						type: 'number',
						typeOptions: {
							minValue: 0,
						},
						default: 0,
						description: 'Quantidade máxima de negócios atrelados ao lead',
					},
					{
						displayName: 'Listas',
						name: 'lists',
						type: 'string',
						default: '',
						description: 'Lista de IDs de listas. Formato: <operação> <id1>,<id2>,<id3>. Operações: some, every, none. Ex: "every 849fefab-e697-4720-9303-e788c23790cc"',
					},
					{
						displayName: 'Possui Mensagens',
						name: 'hasMessages',
						type: 'boolean',
						default: false,
						description: 'Leads que já possuem alguma mensagem no CRM',
					},
					{
						displayName: 'Não Possui Mensagens',
						name: 'notHasMessages',
						type: 'boolean',
						default: false,
						description: 'Leads que não possuem nenhuma mensagem no CRM',
					},
					{
						displayName: 'Origem',
						name: 'source',
						type: 'string',
						default: '',
						description: 'Lead por sua origem. Ex: "Google Ads"',
					},
					{
						displayName: 'Produtos',
						name: 'products',
						type: 'string',
						default: '',
						description: 'Lista de IDs de SKUs. Formato: <operação> <id1>,<id2>,<id3>. Operações: some, every, none. Ex: "none 849fefab-e697-4720-9303-e788c23790cc"',
					},
					{
						displayName: 'Atendente',
						name: 'attendant',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getAttendants',
						},
						default: '',
						description: 'Selecione o atendente para filtrar',
					},
					{
						displayName: 'Campos Personalizados',
						name: 'fields',
						type: 'string',
						default: '',
						description: 'Expressões de filtro em campos adicionais. Formato: <idDoCampo> <operação> <valorDoCampo>. Operações: contains, eq, not. Ex: "6f236135-0c72-40d2-9ff5-18c983aeb02b contains texto do campo"',
					},
					{
						displayName: 'Data de Criação (Maior ou Igual)',
						name: 'createdAtGreaterOrEqual',
						type: 'dateTime',
						default: '',
						description: 'Data de criação do lead (maior ou igual). Filtrar leads criados na data especificada ou posterior. Formato ISO 8601',
					},
					{
						displayName: 'Data de Criação (Menor ou Igual)',
						name: 'createdAtLessOrEqual',
						type: 'dateTime',
						default: '',
						description: 'Data de criação do lead (menor ou igual). Filtrar leads criados na data especificada ou anterior. Formato ISO 8601',
					},
					{
						displayName: 'Endereço',
						name: 'address',
						type: 'string',
						default: '',
						description: 'Filtros de endereço. Formato: <campo> <valorDoCampo>,<campo> <valorDoCampo>. Campos: block (bairro), city (cidade), state (estado), country (país). Ex: "city São Paulo"',
					},
				],
			},
		],
	},
];

export default leadsFields;
