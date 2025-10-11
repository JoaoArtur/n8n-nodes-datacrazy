import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import { ILead, ILeadQueryParams } from './leads.types';

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

		// Handle tags
		if (additional.tags?.length > 0) {
			leadData.tags = additional.tags.map((tag: any) => ({
				id: tag.tagDetails?.id ? tag.tagDetails.id.split(',').map((id: string) => id.trim()) : []
			}));
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

	// Filtros avançados - usar formato flat com prefixo filter. (igual aos deals)
	if (options.filters && Array.isArray(options.filters) && options.filters.length > 0) {
		// Processar cada filtro individualmente
		options.filters.forEach((filterItem: any) => {
			if (filterItem.tags && filterItem.tags.trim()) {
				queryParams['filter.tags'] = filterItem.tags.trim();
			}
			if (filterItem.stages && filterItem.stages.trim()) {
				queryParams['filter.stages'] = filterItem.stages.trim();
			}
			if (filterItem.minLastPurchaseDate && filterItem.minLastPurchaseDate.trim()) {
				queryParams['filter.minLastPurchaseDate'] = filterItem.minLastPurchaseDate.trim();
			}
			if (filterItem.maxLastPurchaseDate && filterItem.maxLastPurchaseDate.trim()) {
				queryParams['filter.maxLastPurchaseDate'] = filterItem.maxLastPurchaseDate.trim();
			}
			if (filterItem.productsInBusiness !== undefined && filterItem.productsInBusiness !== null) {
				queryParams['filter.productsInBusiness'] = filterItem.productsInBusiness;
			}
			if (filterItem.minBusinessesCount !== undefined && filterItem.minBusinessesCount !== null) {
				queryParams['filter.minBusinessesCount'] = filterItem.minBusinessesCount;
			}
			if (filterItem.maxBusinessesCount !== undefined && filterItem.maxBusinessesCount !== null) {
				queryParams['filter.maxBusinessesCount'] = filterItem.maxBusinessesCount;
			}
			if (filterItem.lists && filterItem.lists.trim()) {
				queryParams['filter.lists'] = filterItem.lists.trim();
			}
			if (filterItem.hasMessages !== undefined && filterItem.hasMessages !== null) {
				queryParams['filter.hasMessages'] = filterItem.hasMessages;
			}
			if (filterItem.notHasMessages !== undefined && filterItem.notHasMessages !== null) {
				queryParams['filter.notHasMessages'] = filterItem.notHasMessages;
			}
			if (filterItem.source && filterItem.source.trim()) {
				queryParams['filter.source'] = filterItem.source.trim();
			}
			if (filterItem.products && filterItem.products.trim()) {
				queryParams['filter.products'] = filterItem.products.trim();
			}
			if (filterItem.attendant && filterItem.attendant.trim()) {
				queryParams['filter.attendant'] = filterItem.attendant.trim();
			}
			if (filterItem.fields && filterItem.fields.trim()) {
				queryParams['filter.fields'] = filterItem.fields.trim();
			}
			if (filterItem.createdAtGreaterOrEqual && filterItem.createdAtGreaterOrEqual.trim()) {
				queryParams['filter.createdAtGreaterOrEqual'] = filterItem.createdAtGreaterOrEqual.trim();
			}
			if (filterItem.createdAtLessOrEqual && filterItem.createdAtLessOrEqual.trim()) {
				queryParams['filter.createdAtLessOrEqual'] = filterItem.createdAtLessOrEqual.trim();
			}
			if (filterItem.address && filterItem.address.trim()) {
				queryParams['filter.address'] = filterItem.address.trim();
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