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
export function buildLeadQueryParams(options: any): ILeadQueryParams {
	const queryParams: ILeadQueryParams = {};

	// Parâmetros básicos
	if (options.skip !== undefined) queryParams.skip = options.skip;
	if (options.take !== undefined) queryParams.take = options.take;
	if (options.search) queryParams.search = options.search;

	// Opções de complete
	if (options.complete?.completeOptions) {
		queryParams.complete = {};
		if (options.complete.completeOptions.additionalFields !== undefined) {
			queryParams.complete.additionalFields = options.complete.completeOptions.additionalFields;
		}
	}

	// Filtros avançados - acessar através de filterOptions
	if (options.filter?.filterOptions) {
		const filterData = options.filter.filterOptions;
		queryParams.filter = {};
		
		if (filterData.tags) queryParams.filter.tags = filterData.tags;
		if (filterData.stages) queryParams.filter.stages = filterData.stages;
		if (filterData.minLastPurchaseDate) queryParams.filter.minLastPurchaseDate = filterData.minLastPurchaseDate;
		if (filterData.maxLastPurchaseDate) queryParams.filter.maxLastPurchaseDate = filterData.maxLastPurchaseDate;
		if (filterData.productsInBusiness !== undefined) queryParams.filter.productsInBusiness = filterData.productsInBusiness;
		if (filterData.minBusinessesCount !== undefined) queryParams.filter.minBusinessesCount = filterData.minBusinessesCount;
		if (filterData.maxBusinessesCount !== undefined) queryParams.filter.maxBusinessesCount = filterData.maxBusinessesCount;
		if (filterData.lists) queryParams.filter.lists = filterData.lists;
		if (filterData.hasMessages !== undefined) queryParams.filter.hasMessages = filterData.hasMessages;
		if (filterData.notHasMessages !== undefined) queryParams.filter.notHasMessages = filterData.notHasMessages;
		if (filterData.source) queryParams.filter.source = filterData.source;
		if (filterData.products) queryParams.filter.products = filterData.products;
		if (filterData.attendant) queryParams.filter.attendant = filterData.attendant;
		if (filterData.fields) queryParams.filter.fields = filterData.fields;
		if (filterData.createdAtGreaterOrEqual) queryParams.filter.createdAtGreaterOrEqual = filterData.createdAtGreaterOrEqual;
		if (filterData.createdAtLessOrEqual) queryParams.filter.createdAtLessOrEqual = filterData.createdAtLessOrEqual;
		if (filterData.address) queryParams.filter.address = filterData.address;
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