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
		required: true,
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
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'tagDetails',
						displayName: 'Tag',
						values: [
							{
								displayName: 'IDs das Tags',
								name: 'id',
								type: 'string',
								default: '',
								description: 'IDs das tags separados por vírgula',
							},
						],
					},
				],
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
								type: 'string',
								default: '',
								description: 'ID único do atendente responsável',
							},
						],
					},
				],
			},
		],
	},

	// Options for getAll operation
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
			{
				displayName: 'Limite',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				default: 50,
				description: 'Número máximo de leads para retornar',
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
				displayName: 'Ordenar Por',
				name: 'sortBy',
				type: 'options',
				options: [
					{
						name: 'Data de Criação',
						value: 'createdAt',
					},
					{
						name: 'Data de Atualização',
						value: 'updatedAt',
					},
					{
						name: 'Nome',
						value: 'name',
					},
					{
						name: 'Email',
						value: 'email',
					},
				],
				default: 'createdAt',
				description: 'Campo para ordenação dos resultados',
			},
			{
				displayName: 'Ordem',
				name: 'sortOrder',
				type: 'options',
				options: [
					{
						name: 'Crescente',
						value: 'asc',
					},
					{
						name: 'Decrescente',
						value: 'desc',
					},
				],
				default: 'desc',
				description: 'Ordem de classificação',
			},
			{
				displayName: 'Filtrar por Origem',
				name: 'source',
				type: 'string',
				default: '',
				description: 'Filtrar leads por origem específica',
			},
			{
				displayName: 'Filtrar por Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Filtrar leads por email específico',
			},
		],
	},
];

export default leadsFields;
