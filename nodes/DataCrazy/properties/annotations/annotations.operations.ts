import { INodeProperties } from 'n8n-workflow';

export const annotationsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['annotations'],
			},
		},
		options: [
			{
				name: 'Buscar Comentários',
				value: 'getAll',
				description: 'Buscar todos os comentários de um lead',
				action: 'Buscar comentários do lead',
			},
			{
				name: 'Adicionar Comentário',
				value: 'create',
				description: 'Adicionar um comentário ao lead',
				action: 'Adicionar comentário ao lead',
			},
			{
				name: 'Atualizar Comentário',
				value: 'update',
				description: 'Atualizar um comentário do lead',
				action: 'Atualizar comentário do lead',
			},
			{
				name: 'Excluir Comentário',
				value: 'delete',
				description: 'Excluir um comentário do lead',
				action: 'Excluir comentário do lead',
			},
		],
		default: 'getAll',
	},
];