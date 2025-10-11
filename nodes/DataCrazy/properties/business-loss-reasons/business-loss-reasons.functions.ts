import type { ILoadOptionsFunctions } from 'n8n-workflow';
import type { IBusinessLossReasonsResponse, IBusinessLossReasonsQueryParams } from './business-loss-reasons.types';
import { requestForLoadOptions } from '../../GenericFunctions';

/**
 * Busca os motivos de perda de negócio para uso em loadOptions
 */
export async function getBusinessLossReasonsForLoadOptions(
	this: ILoadOptionsFunctions,
	queryParams?: IBusinessLossReasonsQueryParams,
): Promise<IBusinessLossReasonsResponse> {
	try {
		const defaultParams: IBusinessLossReasonsQueryParams = {
			take: 100,
			skip: 0,
			...queryParams,
		};

		const response = await requestForLoadOptions(
			this,
			'GET',
			'/crm/business-loss-reasons',
			undefined,
			defaultParams,
			'https://api.datacrazy.io/v1/api/v1/crm',
		);
		return response as IBusinessLossReasonsResponse;
	} catch (error: any) {
		throw new Error(`Erro ao buscar motivos de perda: ${error.message}`);
	}
}