import { IExecuteFunctions } from 'n8n-workflow';
import { request } from '../../GenericFunctions';
import { 
	IDealActionMove, 
	IDealActionWin, 
	IDealActionLose, 
	IDealActionRestore, 
	IDealActionResponse 
} from './deal-actions.types';

/**
 * Mover negócios para outro estágio
 */
export async function moveDealAction(this: IExecuteFunctions, actionData: IDealActionMove): Promise<IDealActionResponse> {
	const endpoint = '/businesses/actions/move';
	return await request(this, 'POST', endpoint, actionData);
}

/**
 * Marcar negócios como ganhos
 */
export async function winDealAction(this: IExecuteFunctions, actionData: IDealActionWin): Promise<IDealActionResponse> {
	const endpoint = '/businesses/actions/win';
	return await request(this, 'POST', endpoint, actionData);
}

/**
 * Marcar negócios como perdidos
 */
export async function loseDealAction(this: IExecuteFunctions, actionData: IDealActionLose): Promise<IDealActionResponse> {
	const endpoint = '/businesses/actions/lose';
	return await request(this, 'POST', endpoint, actionData);
}

/**
 * Restaurar negócios
 */
export async function restoreDealAction(this: IExecuteFunctions, actionData: IDealActionRestore): Promise<IDealActionResponse> {
	const endpoint = '/businesses/actions/restore';
	return await request(this, 'POST', endpoint, actionData);
}

/**
 * Função auxiliar para construir dados de ação de mover
 */
export function buildMoveActionData(data: any): IDealActionMove {
	return {
		ids: Array.isArray(data.ids) ? data.ids : [data.ids],
		destinationPipelineId: data.destinationPipelineId,
		destinationStageId: data.destinationStageId,
	};
}

/**
 * Função auxiliar para construir dados de ação de ganhar
 */
export function buildWinActionData(data: any): IDealActionWin {
	return {
		ids: Array.isArray(data.ids) ? data.ids : [data.ids],
	};
}

/**
 * Função auxiliar para construir dados de ação de perder
 */
export function buildLoseActionData(data: any): IDealActionLose {
	return {
		ids: Array.isArray(data.ids) ? data.ids : [data.ids],
		lossReasonId: data.lossReasonId,
		justification: data.justification,
	};
}

/**
 * Função auxiliar para construir dados de ação de restaurar
 */
export function buildRestoreActionData(data: any): IDealActionRestore {
	return {
		ids: Array.isArray(data.ids) ? data.ids : [data.ids],
	};
}