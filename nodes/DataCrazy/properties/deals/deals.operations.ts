import { INodeProperties } from 'n8n-workflow';

const dealsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deals'],
			},
		},
		options: [
			{
				name: 'Buscar Negócios',
				value: 'getAll',
				description: 'Buscar todos os negócios',
				action: 'Buscar todos os negócios',
			},
			{
				name: 'Criar Negócio',
				value: 'create',
				description: 'Criar um novo negócio',
				action: 'Criar um novo negócio',
			},
			{
				name: 'Buscar por ID',
				value: 'get',
				description: 'Buscar negócio por ID',
				action: 'Buscar negócio por ID',
			},
			{
				name: 'Atualizar Negócio',
				value: 'update',
				description: 'Atualizar um negócio existente',
				action: 'Atualizar um negócio existente',
			},
			{
				name: 'Excluir Negócio',
				value: 'delete',
				description: 'Excluir um negócio',
				action: 'Excluir um negócio',
			},
		],
		default: 'getAll',
	},
];

export default dealsOperations;