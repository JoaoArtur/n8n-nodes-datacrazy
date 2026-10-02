import { INodeProperties } from 'n8n-workflow';

export const activitiesFields: INodeProperties[] = [
	// Campo Activity ID - usado para get, update e delete
	{
		displayName: 'ID da Atividade',
		name: 'activityId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['activities'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'ID único da atividade',
	},

	// Campo Título - obrigatório para create
	{
		displayName: 'Título',
		name: 'activityTitle',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['activities'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Título da atividade',
	},

	// Campo Lead ID - obrigatório para create
	{
		displayName: 'ID do Lead',
		name: 'activityLeadId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['activities'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'ID do lead vinculado à atividade',
	},

	// Campos adicionais para create e update
	{
		displayName: 'Campos Adicionais',
		name: 'activityAdditionalFields',
		type: 'collection',
		placeholder: 'Adicionar Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['activities'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Título',
				name: 'title',
				type: 'string',
				displayOptions: {
					show: {
						'/operation': ['update'],
					},
				},
				default: '',
				description: 'Título da atividade',
			},
			{
				displayName: 'ID do Lead',
				name: 'leadId',
				type: 'string',
				displayOptions: {
					show: {
						'/operation': ['update'],
					},
				},
				default: '',
				description: 'ID do lead vinculado à atividade',
			},
			{
				displayName: 'Descrição',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Descrição da atividade',
			},
			{
				displayName: 'Data de Início',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Data de início da atividade. Formato ISO 8601',
			},
			{
				displayName: 'Data de Término',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Data de término da atividade. Formato ISO 8601',
			},
			{
				displayName: 'Atendente',
				name: 'attendantId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAttendants',
				},
				default: '',
				description: 'Selecione o atendente responsável pela atividade',
			},
			{
				displayName: 'Obrigatória',
				name: 'required',
				type: 'boolean',
				default: false,
				description: 'Se a atividade é obrigatória',
			},
			{
				displayName: 'Vincular ao Estágio',
				name: 'linkToStage',
				type: 'boolean',
				default: false,
				description: 'Se a atividade deve ser vinculada ao estágio',
			},
			{
				displayName: 'ID do Negócio',
				name: 'businessId',
				type: 'string',
				default: '',
				description: 'ID do negócio vinculado à atividade',
			},
			{
				displayName: 'ID do Tipo de Atividade',
				name: 'activityTypeId',
				type: 'string',
				default: '',
				description: 'ID do tipo de atividade',
			},
			{
				displayName: 'ID do Fluxo',
				name: 'flowId',
				type: 'string',
				default: '',
				description: 'ID do fluxo vinculado à atividade',
			},
		],
	},

	// Opções de busca para getAll
	{
		displayName: 'Opções de Busca',
		name: 'activityOptions',
		type: 'collection',
		placeholder: 'Adicionar Opção',
		default: {},
		displayOptions: {
			show: {
				resource: ['activities'],
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
				description: 'Número máximo de atividades para retornar (máximo 100)',
			},
			{
				displayName: 'Buscar',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Termo de busca para filtrar atividades',
			},
			{
				displayName: 'Filtros',
				name: 'filters',
				type: 'collection',
				placeholder: 'Adicionar Filtro',
				default: {},
				options: [
					{
						displayName: 'Atendente',
						name: 'attendantId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getAttendants',
						},
						default: '',
						description: 'Selecione o atendente para filtrar',
					},
					{
						displayName: 'Data de Início (A Partir De)',
						name: 'startDate',
						type: 'dateTime',
						default: '',
						description: 'Filtrar atividades com data de início na data especificada ou posterior. Formato ISO 8601',
					},
					{
						displayName: 'Data de Início (Antes De)',
						name: 'startDateLessThan',
						type: 'dateTime',
						default: '',
						description: 'Filtrar atividades com data de início anterior à data especificada. Formato ISO 8601',
					},
					{
						displayName: 'ID do Tipo de Atividade',
						name: 'typeId',
						type: 'string',
						default: '',
						description: 'Filtrar pelo tipo de atividade',
					},
					{
						displayName: 'Concluída',
						name: 'isCompleted',
						type: 'boolean',
						default: false,
						description: 'Filtrar atividades concluídas ou pendentes',
					},
				],
			},
		],
	},
];
