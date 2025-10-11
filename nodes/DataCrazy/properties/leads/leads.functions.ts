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

	if (options.limit) queryParams.limit = options.limit;
	if (options.page) queryParams.page = options.page;
	if (options.sortBy) queryParams.sortBy = options.sortBy;
	if (options.sortOrder) queryParams.sortOrder = options.sortOrder;
	if (options.source) queryParams.source = options.source;
	if (options.email) queryParams.email = options.email;

	return queryParams;
}