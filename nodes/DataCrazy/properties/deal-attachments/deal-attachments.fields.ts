import { INodeProperties } from 'n8n-workflow';

export const dealAttachmentsFields: INodeProperties[] = [
	// Campo ID do Negócio - usado em todas as operações
	{
		displayName: 'ID do Negócio',
		name: 'dealAttachmentDealId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dealAttachments'],
				operation: ['getAll', 'create', 'delete'],
			},
		},
		default: '',
		description: 'ID único do negócio',
	},

	// Campo IDs dos Anexos - usado no delete em lote
	{
		displayName: 'IDs dos Anexos',
		name: 'dealAttachmentIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dealAttachments'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'IDs dos anexos a serem apagados, separados por vírgula',
	},

	// Campos para create
	{
		displayName: 'URL do Anexo',
		name: 'dealAttachmentUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dealAttachments'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'URL do arquivo anexado',
	},
	{
		displayName: 'Tamanho do Arquivo',
		name: 'dealAttachmentFileSize',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['dealAttachments'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Tamanho do arquivo em bytes',
	},
	{
		displayName: 'Nome do Arquivo',
		name: 'dealAttachmentFileName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dealAttachments'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Nome do arquivo',
	},
	{
		displayName: 'Descrição',
		name: 'dealAttachmentDescription',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['dealAttachments'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Descrição do anexo (opcional)',
	},
];
