import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import type {
	IBusinessLossReason,
	IBusinessLossReasonCreate,
	IBusinessLossReasonUpdate,
	IBusinessLossReasonsQueryParams,
	IBusinessLossReasonsResponse,
} from './business-loss-reasons.types';

/**
 * Buscar todos os motivos de perda
 */
export async function getAllLossReasons(
	this: IExecuteFunctions,
	queryParams?: IBusinessLossReasonsQueryParams,
): Promise<IBusinessLossReasonsResponse> {
	const endpoint = '/business-loss-reasons';
	return await request(this, 'GET', endpoint, undefined, queryParams);
}

/**
 * Criar um novo motivo de perda
 */
export async function createLossReason(
	this: IExecuteFunctions,
	lossReasonData: IBusinessLossReasonCreate,
): Promise<IBusinessLossReason> {
	const endpoint = '/business-loss-reasons';
	return await request(this, 'POST', endpoint, lossReasonData);
}

/**
 * Buscar motivo de perda por ID
 */
export async function getLossReasonById(
	this: IExecuteFunctions,
	lossReasonId: string,
): Promise<IBusinessLossReason> {
	const endpoint = `/business-loss-reasons/${lossReasonId}`;
	return await request(this, 'GET', endpoint);
}

/**
 * Atualizar motivo de perda
 */
export async function updateLossReason(
	this: IExecuteFunctions,
	lossReasonId: string,
	lossReasonData: IBusinessLossReasonUpdate,
): Promise<IBusinessLossReason> {
	const endpoint = `/business-loss-reasons/${lossReasonId}`;
	return await request(this, 'PUT', endpoint, lossReasonData);
}

/**
 * Excluir motivo de perda
 */
export async function deleteLossReason(this: IExecuteFunctions, lossReasonId: string): Promise<void> {
	const endpoint = `/business-loss-reasons/${lossReasonId}`;
	return await request(this, 'DELETE', endpoint);
}

/**
 * Função auxiliar para construir dados do motivo de perda
 */
export function buildLossReasonData(data: any): IBusinessLossReasonCreate | IBusinessLossReasonUpdate {
	const lossReasonData: IBusinessLossReasonUpdate = {};

	if (data.name !== undefined && data.name !== '') {
		lossReasonData.name = data.name;
	}

	if (data.requiredJustification !== undefined) {
		lossReasonData.requiredJustification = data.requiredJustification;
	}

	return lossReasonData;
}

/**
 * Função auxiliar para construir parâmetros de paginação
 */
export function buildLossReasonQueryParams(data: any): IBusinessLossReasonsQueryParams {
	const queryParams: IBusinessLossReasonsQueryParams = {};

	if (data.skip !== undefined) {
		queryParams.skip = data.skip;
	}

	if (data.take !== undefined) {
		queryParams.take = data.take;
	}

	return queryParams;
}
