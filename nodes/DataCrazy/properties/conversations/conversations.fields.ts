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
				operation: ['get', 'sendMessage', 'finish'],
			},
		},
		default: '',
		description: 'ID único da conversa',
	},

	// Send Message Fields
	{
		displayName: 'Tipo de Mensagem',
		name: 'messageType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['conversations'],
				operation: ['sendMessage'],
			},
		},
		options: [
			{
				name: 'Texto',
				value: 'TEXT',
			},
			{
				name: 'Imagem',
				value: 'IMAGE',
			},
			{
				name: 'Vídeo',
				value: 'VIDEO',
			},
			{
				name: 'Áudio',
				value: 'AUDIO',
			},
			{
				name: 'Documento',
				value: 'FILE',
			},
		],
		default: 'TEXT',
		description: 'Tipo de mensagem a ser enviada',
	},

	{
		displayName: 'Mensagem',
		name: 'body',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['conversations'],
				operation: ['sendMessage'],
				messageType: ['TEXT'],
			},
		},
		default: '',
		description: 'Conteúdo da mensagem de texto',
	},

	{
		displayName: 'URL do Arquivo',
		name: 'attachmentUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['conversations'],
				operation: ['sendMessage'],
				messageType: ['IMAGE', 'VIDEO', 'AUDIO', 'FILE'],
			},
		},
		default: '',
		description: 'URL do arquivo a ser enviado',
	},

	{
		displayName: 'Nome do Arquivo',
		name: 'fileName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['conversations'],
				operation: ['sendMessage'],
				messageType: ['IMAGE', 'VIDEO', 'AUDIO', 'FILE'],
			},
		},
		default: '',
		description: 'Nome do arquivo com extensão',
	},

	{
		displayName: 'Tamanho do Arquivo (bytes)',
		name: 'fileSize',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['conversations'],
				operation: ['sendMessage'],
				messageType: ['IMAGE', 'VIDEO', 'AUDIO', 'FILE'],
			},
		},
		default: 0,
		description: 'Tamanho do arquivo em bytes',
	},

	{
		displayName: 'Texto da Mensagem (Opcional)',
		name: 'body',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['conversations'],
				operation: ['sendMessage'],
				messageType: ['IMAGE', 'VIDEO', 'FILE'],
			},
		},
		default: '',
		description: 'Texto adicional para acompanhar o arquivo (opcional)',
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
				displayName: 'Pipeline',
				name: 'pipeline',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getPipelines',
				},
				default: '',
				description: 'Selecione o pipeline para filtrar por estágio',
			},
			{
				displayName: 'Estágio',
				name: 'stages',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getStages',
					loadOptionsDependsOn: ['options.pipeline'],
				},
				default: '',
				description: 'Selecione o estágio para filtrar (requer seleção de pipeline)',
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
						description: 'Filtrar por departamento específico',
					},
					{
						displayName: 'Instâncias',
						name: 'instanceId',
						type: 'multiOptions',
						typeOptions: {
							loadOptionsMethod: 'getInstances',
						},
						default: [],
						description: 'Selecione as instâncias para filtrar (valores serão unidos com vírgula)',
					},
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
						displayName: 'Atendente',
						name: 'attendant',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getAttendants',
						},
						default: '',
						description: 'Selecione o atendente para filtrar',
					},
				],
			},
		],
	},
];

export default conversationsFields;