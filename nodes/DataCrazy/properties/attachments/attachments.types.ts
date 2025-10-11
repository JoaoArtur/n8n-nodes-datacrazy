// Attachment-specific interfaces and types
export interface IAttachment {
	id?: string;
	attachmentUrl: string;
	fileName: string;
	fileSize: string;
	description?: string;
	leadId?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface IAttachmentCreate {
	attachmentUrl: string;
	fileName: string;
	fileSize: string;
	description?: string;
}