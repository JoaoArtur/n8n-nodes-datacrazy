import { INodeProperties } from 'n8n-workflow';

export const listsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lists'],
			},
		},
		options: [
			{
				name: 'Buscar Todas',
				value: 'getAll',
				description: 'Buscar todas as listas',
				action: 'Buscar todas as listas',
			},
			{
				name: 'Criar',
				value: 'create',
				description: 'Criar uma nova lista',
				action: 'Criar uma lista',
			},
			{
				name: 'Buscar por ID',
				value: 'get',
				description: 'Buscar uma lista específica por ID',
				action: 'Buscar lista por ID',
			},
			{
				name: 'Atualizar',
				value: 'update',
				description: 'Atualizar uma lista existente',
				action: 'Atualizar uma lista',
			},
			{
				name: 'Excluir',
				value: 'delete',
				description: 'Excluir uma lista',
				action: 'Excluir uma lista',
			},
		],
		default: 'getAll',
	},
];