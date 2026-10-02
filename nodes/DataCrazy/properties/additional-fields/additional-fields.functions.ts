import { IExecuteFunctions, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { API_HOST, request, requestForLoadOptions } from '../../GenericFunctions';
import type { IAdditionalField, IAdditionalFieldQueryParams, IAdditionalFieldValue, AdditionalFieldScope } from './additional-fields.types';

// Sem rota em /api/v1: usa a rota do serviço CRM exposta no host público.
const CRM_BASE_URL = `${API_HOST}/api/crm`;

/**
 * Busca todos os campos adicionais disponíveis
 */
export async function getAllAdditionalFields(
	this: IExecuteFunctions,
	scope: AdditionalFieldScope,
	queryParams?: IAdditionalFieldQueryParams,
): Promise<IAdditionalField[]> {
	const endpoint = '/additionalFields';

	// Mapear scope para entity da API
	const entity = scope === 'deal' ? 'business' : 'lead';

	const params = {
		skip: queryParams?.skip || 0,
		take: queryParams?.take || 500,
		filter: {
			entity,
		},
	};

	const response = await request(this, 'GET', endpoint, undefined, params, CRM_BASE_URL);
	return response.data || response;
}

/**
 * Define o valor de um campo adicional
 */
export async function setAdditionalFieldValue(
	this: IExecuteFunctions,
	scope: AdditionalFieldScope,
	entityId: string,
	additionalFieldId: string,
	value: IAdditionalFieldValue,
): Promise<any> {
	// Mapear scope para o endpoint correto
	const entityType = scope === 'deal' ? 'business' : 'lead';
	const endpoint = `/additional-fields/${entityType}/${entityId}/${additionalFieldId}`;

	const response = await request(this, 'PUT', endpoint, value, undefined, CRM_BASE_URL);
	return response;
}

/**
 * Busca campos adicionais para loadOptions (usado no dropdown dinâmico)
 */
export async function getAdditionalFieldsForLoadOptions(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		// Obter o escopo selecionado
		const scope = this.getCurrentNodeParameter('scope') as AdditionalFieldScope;

		// Mapear scope para entity da API
		const entity = scope === 'deal' ? 'business' : 'lead';

		const endpoint = '/additionalFields';
		const params = {
			skip: 0,
			take: 500,
			filter: {
				entity,
			},
		};

		const response = await requestForLoadOptions(this, 'GET', endpoint, undefined, params, CRM_BASE_URL);
		const additionalFields = response.data || response;

		if (!Array.isArray(additionalFields)) {
			return [];
		}

		return additionalFields.map((field: IAdditionalField) => ({
			name: field.name,
			value: field.id,
			description: `Tipo: ${field.type}${field.required ? ' (Obrigatório)' : ''}`,
		}));
	} catch (error) {
		console.error('Erro ao carregar campos adicionais:', error);
		return [];
	}
}

/**
 * Constrói os parâmetros de query para busca de campos adicionais
 */
export function buildAdditionalFieldQueryParams(options: any): IAdditionalFieldQueryParams {
	const params: IAdditionalFieldQueryParams = {};

	if (options.skip !== undefined) {
		params.skip = options.skip;
	}

	if (options.take !== undefined) {
		params.take = options.take;
	}

	return params;
}