import { INodeProperties } from 'n8n-workflow';

const annotationsFields: INodeProperties[] = [
	// Lead ID for all annotation operations
	{
		displayName: 'ID do Lead',
		name: 'leadId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['annotations'],
				operation: ['getAll', 'create', 'update', 'delete'],
			},
		},
		default: '',
		description: 'ID único do lead',
	},

	// Note ID for update and delete operations
	{
		displayName: 'ID do Comentário',
		name: 'noteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['annotations'],
				operation: ['update', 'delete'],
			},
		},
		default: '',
		description: 'ID único do comentário',
	},

	// Note content for create and update operations
	{
		displayName: 'Comentário',
		name: 'note',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['annotations'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Conteúdo do comentário',
	},
];

export { annotationsFields };