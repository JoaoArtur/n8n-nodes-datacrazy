import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import { IAnnotation, IAnnotationCreate, IAnnotationUpdate } from './annotations.types';

// Annotation-specific API functions
export async function getLeadNotes(
	context: IExecuteFunctions,
	leadId: string,
): Promise<any> {
	return await request(context, 'GET', `/leads/${leadId}/notes`);
}

export async function createLeadNote(
	context: IExecuteFunctions,
	leadId: string,
	noteData: IAnnotationCreate,
): Promise<any> {
	return await request(context, 'POST', `/leads/${leadId}/notes`, noteData);
}

export async function updateLeadNote(
	context: IExecuteFunctions,
	leadId: string,
	noteId: string,
	noteData: IAnnotationUpdate,
): Promise<any> {
	return await request(context, 'PUT', `/leads/${leadId}/notes/${noteId}`, noteData);
}

export async function deleteLeadNote(
	context: IExecuteFunctions,
	leadId: string,
	noteId: string,
): Promise<any> {
	return await request(context, 'DELETE', `/leads/${leadId}/notes/${noteId}`);
}

// Helper function to build note data from node parameters
export function buildNoteData(parameters: any): IAnnotationCreate | IAnnotationUpdate {
	return {
		note: parameters.note,
	};
}