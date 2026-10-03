import { INodeProperties } from 'n8n-workflow';

export const instancesOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['instances'],
			},
		},
		options: [
			{
				name: 'Buscar Todas',
				value: 'getAll',
				description: 'Buscar todas as conexões',
				action: 'Buscar todas as conexões',
			},
			{
				name: 'Buscar por ID',
				value: 'get',
				description: 'Buscar uma conexão específica por ID',
				action: 'Buscar conexão por ID',
			},
		],
		default: 'getAll',
	},
];
