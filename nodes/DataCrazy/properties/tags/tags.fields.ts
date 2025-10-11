import { INodeProperties } from 'n8n-workflow';

export const tagsFields: INodeProperties[] = [
	// Campo Tag ID - usado para get, update e delete
	{
		displayName: 'ID da Tag',
		name: 'tagId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tags'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'ID da tag',
	},

	// Campo Nome - obrigatório para create, opcional para update
	{
		displayName: 'Nome',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tags'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Nome da tag',
	},

	// Campo Cor - obrigatório para create, opcional para update
	{
		displayName: 'Cor',
		name: 'color',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['tags'],
				operation: ['create'],
			},
		},
		default: '#A78BFA',
		description: 'Cor da tag em formato hexadecimal (ex: #A78BFA)',
	},

	// Campos adicionais para create e update
	{
		displayName: 'Campos Adicionais',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Adicionar Campo',
		default: {},
		displayOptions: {
			show: {
				resource: ['tags'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Nome',
				name: 'name',
				type: 'string',
				displayOptions: {
					show: {
						'/operation': ['update'],
					},
				},
				default: '',
				description: 'Nome da tag',
			},
			{
				displayName: 'Cor',
				name: 'color',
				type: 'string',
				displayOptions: {
					show: {
						'/operation': ['update'],
					},
				},
				default: '',
				description: 'Cor da tag em formato hexadecimal (ex: #A78BFA)',
			},
			{
				displayName: 'Descrição',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Descrição da tag',
			},
			{
				displayName: 'Usar Cor Aleatória',
				name: 'useRandomColor',
				type: 'boolean',
				default: false,
				description: 'Se deve usar uma cor aleatória para a tag',
			},
		],
	},
];