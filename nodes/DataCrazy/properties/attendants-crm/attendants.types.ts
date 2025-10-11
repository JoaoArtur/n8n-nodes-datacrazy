/**
 * Tipos para operações de atendentes no DataCrazy
 */

export interface IAttendant {
	id: string;
	name: string;
	email?: string;
	active?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface IAttendantsResponse {
	data: IAttendant[];
	total?: number;
	page?: number;
	limit?: number;
}