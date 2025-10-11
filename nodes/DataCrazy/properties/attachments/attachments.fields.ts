import { INodeProperties } from 'n8n-workflow';

const attachmentsFields: INodeProperties[] = [
	// Lead ID for all attachment operations
	{
		displayName: 'ID do Lead',
		name: 'leadId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['attachments'],
				operation: ['getAll', 'create', 'delete'],
			},
		},
		default: '',
		description: 'ID único do lead',
	},

	// Attachment ID for delete operation
	{
		displayName: 'ID do Anexo',
		name: 'attachmentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['attachments'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'ID único do anexo a ser apagado',
	},

	// Fields for create operation
	{
		displayName: 'URL do Anexo',
		name: 'attachmentUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['attachments'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'URL do arquivo anexado',
	},

	{
		displayName: 'Nome do Arquivo',
		name: 'fileName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['attachments'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Nome do arquivo',
	},

	{
		displayName: 'Tamanho do Arquivo',
		name: 'fileSize',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['attachments'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Tamanho do arquivo em bytes',
	},

	{
		displayName: 'Descrição',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['attachments'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Descrição do anexo (opcional)',
	},
];

export { attachmentsFields };