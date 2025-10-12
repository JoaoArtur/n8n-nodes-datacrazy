import { INodeProperties } from 'n8n-workflow';

const conversationsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['conversations'],
			},
		},
		options: [
			{
				name: 'Buscar Conversas',
				value: 'getAll',
				description: 'Buscar todas as conversas',
				action: 'Buscar todas as conversas',
			},
			{
				name: 'Buscar Conversa por ID',
				value: 'get',
				description: 'Buscar conversa por ID e suas mensagens',
				action: 'Buscar conversa por ID',
			},
			{
				name: 'Enviar Mensagem',
				value: 'sendMessage',
				description: 'Enviar mensagem para uma conversa',
				action: 'Enviar mensagem para conversa',
			},
		],
		default: 'getAll',
	},
];

export default conversationsOperations;