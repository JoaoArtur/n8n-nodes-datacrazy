import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import { ILead, ILeadQueryParams } from './leads.types';

// Função auxiliar para formatar data para ISO 8601
function formatDateToISO(dateValue: string): string {
	// Se já está no formato ISO 8601 completo, retorna como está
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
		return dateValue;
	}
	
	// Se está no formato ISO 8601 mas sem milissegundos, adiciona
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)) {
		return dateValue.replace('Z', '.000Z');
	}
	
	// Se está no formato ISO 8601 mas sem timezone, adiciona
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
		return dateValue + '.000Z';
	}
	
	// Se está no formato YYYY-MM-DD HH:mm:ss, converte para ISO 8601
	if (dateValue.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
		return dateValue.replace(' ', 'T') + '.000Z';
	}
	
	// Se está no formato YYYY-MM-DD, adiciona horário
	if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
		return dateValue + 'T00:00:00.000Z';
	}
	
	// Tenta criar uma data válida e converter para ISO
	try {
		const date = new Date(dateValue);
		if (!isNaN(date.getTime())) {
			return date.toISOString();
		}
	} catch (error) {
		// Se não conseguir converter, retorna o valor original
	}
	
	return dateValue;
}

// Lead-specific API functions
export async function getAllLeads(
	context: IExecuteFunctions,
	queryParams?: ILeadQueryParams,
): Promise<any> {
	return await request(context, 'GET', '/leads', undefined, queryParams);
}

export async function createLead(
	context: IExecuteFunctions,
	leadData: ILead,
): Promise<any> {
	return await request(context, 'POST', '/leads', leadData);
}

export async function getLeadById(
	context: IExecuteFunctions,
	leadId: string,
): Promise<any> {
	return await request(context, 'GET', `/leads/${leadId}`);
}

export async function updateLead(
	context: IExecuteFunctions,
	leadId: string,
	leadData: Partial<ILead>,
): Promise<any> {
	return await request(context, 'PATCH', `/leads/${leadId}`, leadData);
}

export async function deleteLead(
	context: IExecuteFunctions,
	leadId: string,
): Promise<any> {
	return await request(context, 'DELETE', `/leads/${leadId}`);
}

// Helper function to build lead data from node parameters
export function buildLeadData(parameters: any): ILead {
	const leadData: ILead = {
		name: parameters.name,
	};

	// Add optional fields
	if (parameters.email) leadData.email = parameters.email;
	if (parameters.phone) leadData.phone = parameters.phone;
	if (parameters.company) leadData.company = parameters.company;
	if (parameters.source) leadData.source = parameters.source;

	// Add additional fields if provided
	if (parameters.additionalFields) {
		const additional = parameters.additionalFields;
		
		if (additional.image) leadData.image = additional.image;
		if (additional.taxId) leadData.taxId = additional.taxId;
		if (additional.site) leadData.site = additional.site;
		if (additional.instagram) leadData.instagram = additional.instagram;

		// Handle address
		if (additional.address?.addressDetails) {
			leadData.address = additional.address.addressDetails;
		}

		// Handle source referral
		if (additional.sourceReferral?.sourceReferralDetails) {
			leadData.sourceReferral = additional.sourceReferral.sourceReferralDetails;
		}

		// Handle tags - novo formato com multiple select
		if (additional.tags && additional.tags.length > 0) {
			leadData.tags = additional.tags.map((tagId: string) => ({ id: tagId }));
		}

		// Handle lists
		if (additional.lists?.length > 0) {
			leadData.lists = additional.lists.map((list: any) => ({
				id: list.listDetails?.id ? list.listDetails.id.split(',').map((id: string) => id.trim()) : []
			}));
		}

		// Handle attendant
		if (additional.attendant?.attendantDetails?.id) {
			leadData.attendant = {
				id: additional.attendant.attendantDetails.id
			};
		}
	}

	return leadData;
}

// Helper function to build query parameters for getAll operation
export function buildLeadQueryParams(options: any): any {
	const queryParams: any = {};

	// Parâmetros básicos
	if (options.skip !== undefined) queryParams.skip = options.skip;
	if (options.take !== undefined) queryParams.take = options.take;
	if (options.search) queryParams.search = options.search;

	// Opções de complete
	if (options.complete?.completeOptions) {
		if (options.complete.completeOptions.additionalFields !== undefined) {
			queryParams['complete[additionalFields]'] = options.complete.completeOptions.additionalFields;
		}
	}

	// Filtros avançados - usar formato de objeto aninhado para gerar filter[campo]
	if (options.filters && Array.isArray(options.filters) && options.filters.length > 0) {
		queryParams.filter = {};
		
		// Processar cada filtro individualmente
		options.filters.forEach((filterItem: any) => {
			// Processar filtro de tags no novo formato
			if (filterItem.tags && filterItem.tags.tagFilter) {
				const tagFilter = filterItem.tags.tagFilter;
				if (tagFilter.operation && tagFilter.tagIds && tagFilter.tagIds.length > 0) {
					const operation = tagFilter.operation;
					const tagIds = tagFilter.tagIds.join(',');
					queryParams.filter.tags = `${operation} ${tagIds}`;
				}
			}
			if (filterItem.stages && filterItem.stages.trim()) {
				queryParams.filter.stages = filterItem.stages.trim();
			}
			if (filterItem.minLastPurchaseDate && filterItem.minLastPurchaseDate.trim()) {
				queryParams.filter.minLastPurchaseDate = filterItem.minLastPurchaseDate.trim();
			}
			if (filterItem.maxLastPurchaseDate && filterItem.maxLastPurchaseDate.trim()) {
				queryParams.filter.maxLastPurchaseDate = filterItem.maxLastPurchaseDate.trim();
			}
			if (filterItem.productsInBusiness !== undefined && filterItem.productsInBusiness !== null) {
				queryParams.filter.productsInBusiness = filterItem.productsInBusiness;
			}
			if (filterItem.minBusinessesCount !== undefined && filterItem.minBusinessesCount !== null) {
				queryParams.filter.minBusinessesCount = filterItem.minBusinessesCount;
			}
			if (filterItem.maxBusinessesCount !== undefined && filterItem.maxBusinessesCount !== null) {
				queryParams.filter.maxBusinessesCount = filterItem.maxBusinessesCount;
			}
			if (filterItem.lists && filterItem.lists.trim()) {
				queryParams.filter.lists = filterItem.lists.trim();
			}
			if (filterItem.hasMessages !== undefined && filterItem.hasMessages !== null) {
				queryParams.filter.hasMessages = filterItem.hasMessages;
			}
			if (filterItem.notHasMessages !== undefined && filterItem.notHasMessages !== null) {
				queryParams.filter.notHasMessages = filterItem.notHasMessages;
			}
			if (filterItem.source && filterItem.source.trim()) {
				queryParams.filter.source = filterItem.source.trim();
			}
			if (filterItem.products && filterItem.products.trim()) {
				queryParams.filter.products = filterItem.products.trim();
			}
			if (filterItem.attendant && filterItem.attendant.trim()) {
				queryParams.filter.attendant = filterItem.attendant.trim();
			}
			if (filterItem.fields && filterItem.fields.trim()) {
				queryParams.filter.fields = filterItem.fields.trim();
			}
			if (filterItem.createdAtGreaterOrEqual && filterItem.createdAtGreaterOrEqual.trim()) {
				// Converter para formato ISO 8601 se necessário
				const dateValue = filterItem.createdAtGreaterOrEqual.trim();
				queryParams.filter.createdAtGreaterOrEqual = formatDateToISO(dateValue);
			}
			if (filterItem.createdAtLessOrEqual && filterItem.createdAtLessOrEqual.trim()) {
				// Converter para formato ISO 8601 se necessário
				const dateValue = filterItem.createdAtLessOrEqual.trim();
				queryParams.filter.createdAtLessOrEqual = formatDateToISO(dateValue);
			}
			if (filterItem.address && filterItem.address.trim()) {
				queryParams.filter.address = filterItem.address.trim();
			}
		});
	}

	return queryParams;
}

// New lead-related functions
export async function getLeadActivities(
	context: IExecuteFunctions,
	leadId: string,
): Promise<any> {
	return await request(context, 'GET', `/leads/${leadId}/activities`);
}

export async function getLeadHistory(
	context: IExecuteFunctions,
	leadId: string,
): Promise<any> {
	return await request(context, 'GET', `/leads/${leadId}/history`);
}

export async function getLeadBusinesses(
	context: IExecuteFunctions,
	leadId: string,
): Promise<any> {
	return await request(context, 'GET', `/leads/${leadId}/businesses`);
}