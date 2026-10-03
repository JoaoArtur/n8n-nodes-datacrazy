import { INodeProperties } from 'n8n-workflow';

export const lossReasonsFields: INodeProperties[] = [
	// Campo Motivo de Perda - usado para get, update e delete
	{
		displayName: 'Motivo de Perda',
		name: 'lossReasonRecordId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getLossReasons',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['lossReasons'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'Selecione o motivo de perda',
	},

	// Paginação - usada no getAll
	{
		displayName: 'Pular',
		name: 'lossReasonSkip',
		type: 'number',
		typeOptions: {
			minValue: 0,
		},
		displayOptions: {
			show: {
				resource: ['lossReasons'],
				operation: ['getAll'],
			},
		},
		default: 0,
		description: 'Quantidade de registros a pular',
	},
	{
		displayName: 'Quantidade',
		name: 'lossReasonTake',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['lossReasons'],
				operation: ['getAll'],
			},
		},
		default: 50,
		description: 'Quantidade de registros a retornar',
	},

	// Campos para create
	{
		displayName: 'Nome',
		name: 'lossReasonName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lossReasons'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Nome do motivo de perda',
	},
	{
		displayName: 'Justificativa Obrigatória',
		name: 'lossReasonRequiredJustification',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['lossReasons'],
				operation: ['create'],
			},
		},
		default: false,
		description: 'Se deve exigir justificativa ao usar este motivo de perda',
	},

	// Campos para update
	{
		displayName: 'Campos para Atualizar',
		name: 'lossReasonUpdateFields',
		type: 'collection',
		placeholder: 'Adicionar Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['lossReasons'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Nome',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Nome do motivo de perda',
			},
			{
				displayName: 'Justificativa Obrigatória',
				name: 'requiredJustification',
				type: 'boolean',
				default: false,
				description: 'Se deve exigir justificativa ao usar este motivo de perda',
			},
		],
	},
];
