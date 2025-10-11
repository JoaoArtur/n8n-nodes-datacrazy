import type { INodeProperties } from 'n8n-workflow';

export const pipelinesOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pipelines'],
			},
		},
		options: [
			{
				name: 'Listar Todos',
				value: 'getAll',
				description: 'Lista todos os pipelines disponíveis',
				action: 'Listar todos os pipelines',
			},
			{
				name: 'Listar Estágios',
				value: 'getStages',
				description: 'Lista os estágios de um pipeline específico',
				action: 'Listar estágios do pipeline',
			},
		],
		default: 'getAll',
	},
];