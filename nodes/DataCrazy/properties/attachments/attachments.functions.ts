import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import { IAttachment, IAttachmentCreate } from './attachments.types';

// Attachment-specific API functions
export async function getLeadAttachments(
	context: IExecuteFunctions,
	leadId: string,
): Promise<any> {
	return await request(context, 'GET', `/leads/${leadId}/attachments`);
}

export async function createLeadAttachment(
	context: IExecuteFunctions,
	leadId: string,
	attachmentData: IAttachmentCreate,
): Promise<any> {
	return await request(context, 'POST', `/leads/${leadId}/attachments`, attachmentData);
}

export async function deleteLeadAttachment(
	context: IExecuteFunctions,
	leadId: string,
	attachmentId: string,
): Promise<any> {
	return await request(context, 'DELETE', `/leads/${leadId}/attachments/${attachmentId}`);
}

// Helper function to build attachment data from node parameters
export function buildAttachmentData(parameters: any): IAttachmentCreate {
	const attachmentData: IAttachmentCreate = {
		attachmentUrl: parameters.attachmentUrl,
		fileName: parameters.fileName,
		fileSize: parameters.fileSize,
	};

	// Add optional fields
	if (parameters.description) {
		attachmentData.description = parameters.description;
	}

	return attachmentData;
}