import { INodeProperties } from 'n8n-workflow';

export const dealAttachmentsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dealAttachments'],
			},
		},
		options: [
			{
				name: 'Listar Anexos',
				value: 'getAll',
				description: 'Buscar todos os anexos de um negócio',
				action: 'Listar anexos do negócio',
			},
			{
				name: 'Anexar Arquivo',
				value: 'create',
				description: 'Anexar um arquivo ao negócio',
				action: 'Anexar arquivo ao negócio',
			},
			{
				name: 'Apagar Anexos',
				value: 'delete',
				description: 'Apagar um ou mais anexos do negócio',
				action: 'Apagar anexos do negócio',
			},
		],
		default: 'getAll',
	},
];
