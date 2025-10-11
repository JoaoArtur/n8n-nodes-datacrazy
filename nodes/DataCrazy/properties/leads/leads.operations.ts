import { INodeProperties } from 'n8n-workflow';

const leadsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['leads'],
			},
		},
		options: [
			{
				name: 'Buscar Leads',
				value: 'getAll',
				description: 'Buscar todos os leads',
				action: 'Buscar todos os leads',
			},
			{
				name: 'Criar Lead',
				value: 'create',
				description: 'Criar um novo lead',
				action: 'Criar um novo lead',
			},
			{
				name: 'Buscar por ID',
				value: 'get',
				description: 'Buscar lead por ID',
				action: 'Buscar lead por ID',
			},
			{
				name: 'Atualizar Lead',
				value: 'update',
				description: 'Atualizar um lead existente',
				action: 'Atualizar um lead existente',
			},
			{
				name: 'Excluir Lead',
				value: 'delete',
				description: 'Excluir um lead',
				action: 'Excluir um lead',
			},
		],
		default: 'getAll',
	},
];

export default leadsOperations;
