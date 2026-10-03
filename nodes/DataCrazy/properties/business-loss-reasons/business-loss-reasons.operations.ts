import { INodeProperties } from 'n8n-workflow';

export const lossReasonsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lossReasons'],
			},
		},
		options: [
			{
				name: 'Buscar Todos',
				value: 'getAll',
				description: 'Buscar todos os motivos de perda',
				action: 'Buscar todos os motivos de perda',
			},
			{
				name: 'Criar',
				value: 'create',
				description: 'Criar um novo motivo de perda',
				action: 'Criar um motivo de perda',
			},
			{
				name: 'Buscar por ID',
				value: 'get',
				description: 'Buscar um motivo de perda específico por ID',
				action: 'Buscar motivo de perda por ID',
			},
			{
				name: 'Atualizar',
				value: 'update',
				description: 'Atualizar um motivo de perda existente',
				action: 'Atualizar um motivo de perda',
			},
			{
				name: 'Excluir',
				value: 'delete',
				description: 'Excluir um motivo de perda',
				action: 'Excluir um motivo de perda',
			},
		],
		default: 'getAll',
	},
];
