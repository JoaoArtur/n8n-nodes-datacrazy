import { INodeProperties } from 'n8n-workflow';

export const attendantsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['attendants'],
			},
		},
		options: [
			{
				name: 'Buscar Todos (CRM)',
				value: 'getAllCrm',
				description: 'Buscar todos os atendentes do CRM',
				action: 'Buscar todos os atendentes do CRM',
			},
			{
				name: 'Buscar por ID (CRM)',
				value: 'getCrm',
				description: 'Buscar um atendente específico do CRM por ID',
				action: 'Buscar atendente do CRM por ID',
			},
			{
				name: 'Buscar Todos (Multi)',
				value: 'getAllMulti',
				description: 'Buscar todos os atendentes do Multi',
				action: 'Buscar todos os atendentes do Multi',
			},
			{
				name: 'Buscar por ID (Multi)',
				value: 'getMulti',
				description: 'Buscar um atendente específico do Multi por ID',
				action: 'Buscar atendente do Multi por ID',
			},
		],
		default: 'getAllCrm',
	},
];
