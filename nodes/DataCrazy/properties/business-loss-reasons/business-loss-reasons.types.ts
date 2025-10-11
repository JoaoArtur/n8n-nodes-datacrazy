/**
 * Interface para representar um motivo de perda de negócio
 */
export interface IBusinessLossReason {
	id: string;
	name: string;
	requiredJustification: boolean;
	createdAt: string;
}

/**
 * Interface para resposta da API de motivos de perda
 */
export interface IBusinessLossReasonsResponse {
	count: number;
	data: IBusinessLossReason[];
}

/**
 * Interface para parâmetros de query da API de motivos de perda
 */
export interface IBusinessLossReasonsQueryParams {
	take?: number;
	skip?: number;
	search?: string;
	[key: string]: any; // Index signature para compatibilidade com IDataObject
}