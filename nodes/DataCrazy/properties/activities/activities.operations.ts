import { INodeProperties } from 'n8n-workflow';

export const activitiesOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['activities'],
			},
		},
		options: [
			{
				name: 'Buscar Todas',
				value: 'getAll',
				description: 'Buscar todas as atividades',
				action: 'Buscar todas as atividades',
			},
			{
				name: 'Criar',
				value: 'create',
				description: 'Criar uma nova atividade',
				action: 'Criar uma atividade',
			},
			{
				name: 'Buscar por ID',
				value: 'get',
				description: 'Buscar uma atividade específica por ID',
				action: 'Buscar atividade por ID',
			},
			{
				name: 'Atualizar',
				value: 'update',
				description: 'Atualizar uma atividade existente',
				action: 'Atualizar uma atividade',
			},
			{
				name: 'Excluir',
				value: 'delete',
				description: 'Excluir uma atividade',
				action: 'Excluir uma atividade',
			},
		],
		default: 'getAll',
	},
];