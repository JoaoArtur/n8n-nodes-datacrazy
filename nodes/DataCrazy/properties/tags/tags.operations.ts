import { INodeProperties } from 'n8n-workflow';

export const tagsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tags'],
			},
		},
		options: [
			{
				name: 'Buscar Todas',
				value: 'getAll',
				description: 'Buscar todas as tags',
				action: 'Buscar todas as tags',
			},
			{
				name: 'Criar',
				value: 'create',
				description: 'Criar uma nova tag',
				action: 'Criar uma tag',
			},
			{
				name: 'Buscar por ID',
				value: 'get',
				description: 'Buscar uma tag específica por ID',
				action: 'Buscar tag por ID',
			},
			{
				name: 'Atualizar',
				value: 'update',
				description: 'Atualizar uma tag existente',
				action: 'Atualizar uma tag',
			},
			{
				name: 'Excluir',
				value: 'delete',
				description: 'Excluir uma tag',
				action: 'Excluir uma tag',
			},
		],
		default: 'getAll',
	},
];