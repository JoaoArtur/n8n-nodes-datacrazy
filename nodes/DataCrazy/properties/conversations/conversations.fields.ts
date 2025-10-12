import { INodeProperties } from 'n8n-workflow';

const conversationsFields: INodeProperties[] = [
	// Conversation ID for operations that need it
	{
		displayName: 'ID da Conversa',
		name: 'conversationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['conversations'],
				operation: ['get', 'sendMessage'],
			},
		},
		default: '',
		description: 'ID único da conversa',
	},

	// Send Message Fields
	{
		displayName: 'Mensagem',
		name: 'body',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['conversations'],
				operation: ['sendMessage'],
			},
		},
		default: '',
		description: 'Conteúdo da mensagem a ser enviada',
	},

	// Additional Fields for Send Message
	{
		displayName: 'Campos Adicionais',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Adicionar Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['conversations'],
				operation: ['sendMessage'],
			},
		},
		options: [
			{
				displayName: 'ID da Mensagem Respondida',
				name: 'repliedMessageId',
				type: 'string',
				default: '',
				description: 'ID da mensagem que está sendo respondida',
			},
			{
				displayName: 'Data Agendada',
				name: 'scheduledDate',
				type: 'dateTime',
				default: '',
				description: 'Data e hora para envio agendado da mensagem (formato ISO 8601)',
			},
			{
				displayName: 'Mensagem Interna',
				name: 'isInternal',
				type: 'boolean',
				default: false,
				description: 'Indica se a mensagem é interna (não visível para o cliente)',
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
				resource: ['conversations'],
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
				description: 'Número máximo de conversas para retornar (máximo 100)',
			},
			{
				displayName: 'Buscar',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Termo de busca para filtrar conversas',
			},
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
						displayName: 'Conversas Inicializadas',
						name: 'initialized',
						type: 'boolean',
						default: true,
						description: 'Valor booleano para conversas em aberto. Por padrão o valor é true, caso o valor seja false retorna todas as conversas (incluindo finalizadas)',
					},
					{
						displayName: 'Departamento',
						name: 'department',
						type: 'string',
						default: '',
						description: 'ID do departamento. Este campo aceita um único ID de departamento',
						placeholder: 'e3581d38-aeab-483a-8275-de32dce2388a',
					},
					{
						displayName: 'Instâncias',
						name: 'instanceId',
						type: 'string',
						default: '',
						description: 'ID ou Lista de IDs de instâncias. Este campo aceita um único ou uma lista de IDs separados por vírgula',
						placeholder: '682f0a3823f2d4e36a2150c0,6808667d911e4c8975bc5405',
					},
					{
						displayName: 'Tags',
						name: 'tags',
						type: 'string',
						default: '',
						description: 'ID ou lista de IDs de tags. Este campo aceita um ID ou uma lista de IDs de tags separados por vírgula',
						placeholder: '849fefab-e697-4720-9303-e788c23790cc,9e008d34-86d2-49fd-90af-34a9f9b29896',
					},
					{
						displayName: 'Estágios',
						name: 'stages',
						type: 'string',
						default: '',
						description: 'ID do stage. Este campo aceita um único ID, referente a um estágio de pipeline',
						placeholder: '849fefab-e697-4720-9303-e788c23790cc',
					},
					{
						displayName: 'Atendente',
						name: 'attendant',
						type: 'string',
						default: '',
						description: 'ID do atendente. Este campo aceita um único ID, referente a um atendente',
						placeholder: '849fefab-e697-4720-9303-e788c23790cc',
					},
				],
			},
		],
	},
];

export default conversationsFields;