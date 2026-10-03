import { INodeProperties } from 'n8n-workflow';

export const productsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['products'],
			},
		},
		options: [
			{
				name: 'Buscar Todos',
				value: 'getAll',
				description: 'Buscar todos os produtos',
				action: 'Buscar todos os produtos',
			},
			{
				name: 'Criar',
				value: 'create',
				description: 'Criar um novo produto',
				action: 'Criar um produto',
			},
			{
				name: 'Buscar por ID',
				value: 'get',
				description: 'Buscar um produto específico por ID',
				action: 'Buscar produto por ID',
			},
			{
				name: 'Atualizar',
				value: 'update',
				description: 'Atualizar um produto existente',
				action: 'Atualizar um produto',
			},
			{
				name: 'Excluir',
				value: 'delete',
				description: 'Excluir um produto',
				action: 'Excluir um produto',
			},
		],
		default: 'getAll',
	},
];