import { INodeProperties } from 'n8n-workflow';

const additionalFieldsOperations: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['additionalFields'],
			},
		},
		options: [
			{
				name: 'Buscar Campos Adicionais',
				value: 'getAll',
				description: 'Buscar todos os campos adicionais disponíveis',
				action: 'Buscar todos os campos adicionais',
			},
			{
				name: 'Definir Campo Adicional',
				value: 'setValue',
				description: 'Definir valor de um campo adicional em um lead ou negócio',
				action: 'Definir valor de campo adicional',
			},
		],
		default: 'getAll',
	},
];

export default additionalFieldsOperations;