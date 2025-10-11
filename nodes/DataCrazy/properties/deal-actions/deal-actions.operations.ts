import { INodeProperties } from 'n8n-workflow';

export const dealActionsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dealActions'],
			},
		},
		options: [
			{
				name: 'Mover',
				value: 'move',
				description: 'Mover negócios para outro estágio',
				action: 'Mover negócios',
			},
			{
				name: 'Ganhar',
				value: 'win',
				description: 'Marcar negócios como ganhos',
				action: 'Marcar negócios como ganhos',
			},
			{
				name: 'Perder',
				value: 'lose',
				description: 'Marcar negócios como perdidos',
				action: 'Marcar negócios como perdidos',
			},
			{
				name: 'Restaurar',
				value: 'restore',
				description: 'Restaurar negócios',
				action: 'Restaurar negócios',
			},
		],
		default: 'move',
	},
];