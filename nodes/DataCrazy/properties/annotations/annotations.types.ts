// Annotation-specific interfaces and types
export interface IAnnotation {
	id?: string;
	note: string;
	leadId?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface IAnnotationCreate {
	note: string;
}

export interface IAnnotationUpdate {
	note: string;
}