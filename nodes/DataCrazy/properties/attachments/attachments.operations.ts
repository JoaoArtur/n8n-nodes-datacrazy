import { INodeProperties } from 'n8n-workflow';

export const attachmentsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['attachments'],
			},
		},
		options: [
			{
				name: 'Listar Anexos',
				value: 'getAll',
				description: 'Buscar todos os anexos de um lead',
				action: 'Listar anexos do lead',
			},
			{
				name: 'Anexar Arquivo',
				value: 'create',
				description: 'Anexar um arquivo ao lead',
				action: 'Anexar arquivo ao lead',
			},
			{
				name: 'Apagar Anexo',
				value: 'delete',
				description: 'Apagar um anexo do lead',
				action: 'Apagar anexo do lead',
			},
		],
		default: 'getAll',
	},
];