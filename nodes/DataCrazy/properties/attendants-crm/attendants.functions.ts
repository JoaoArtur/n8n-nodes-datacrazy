import { ILoadOptionsFunctions } from 'n8n-workflow';
import { requestForLoadOptions } from '../../GenericFunctions';
import { IAttendantsResponse } from './attendants.types';

/**
 * Buscar atendentes para loadOptions
 */
export async function getAttendantsForLoadOptions(
	context: ILoadOptionsFunctions,
): Promise<{ name: string; value: string }[]> {
	try {
		const endpoint = '/attendants/crm';
		const response: IAttendantsResponse = await requestForLoadOptions(context, 'GET', endpoint);
		
		// Mapear os dados para o formato esperado pelo n8n
		return response.data.map((attendant) => ({
			name: attendant.name,
			value: attendant.id,
		}));
	} catch (error) {
		console.error('Erro ao buscar atendentes:', error);
		return [];
	}
}