/**
 * Interfaces e tipos para operações de negócios (deals) no DataCrazy
 */

/**
 * Interface para um negócio (deal)
 */
export interface IDeal {
	id?: string;
	leadId: string;
	stageId: string;
	attendantId: string;
	externalId?: string;
	createdAt?: string;
	updatedAt?: string;
	deletedAt?: string | null;
}

/**
 * Interface para parâmetros de consulta de negócios
 */
export interface IDealQueryParams {
	page?: number;
	limit?: number;
	leadId?: string;
	stageId?: string;
	attendantId?: string;
	externalId?: string;
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Interface para dados de criação de negócio
 */
export interface ICreateDealData {
	leadId: string;
	stageId: string;
	attendantId: string;
	externalId?: string;
}

/**
 * Interface para dados de atualização de negócio
 */
export interface IUpdateDealData {
	leadId?: string;
	stageId?: string;
	attendantId?: string;
	externalId?: string;
}

/**
 * Interface para resposta da API de negócios
 */
export interface IDealsResponse {
	data: IDeal[];
	total?: number;
	page?: number;
	limit?: number;
}

/**
 * Interface para resposta de um único negócio
 */
export interface IDealResponse {
	data: IDeal;
}