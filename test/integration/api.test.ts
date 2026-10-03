/**
 * Testes contra a API real. Exigem DATACRAZY_API_KEY no ambiente.
 * Operações de escrita (criam e removem registros de teste) só rodam com DATACRAZY_E2E_WRITE=1.
 */
import { after, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { DataCrazy } from '../../nodes/DataCrazy/DataCrazy.node';

const API_KEY = process.env.DATACRAZY_API_KEY;
const WRITE = process.env.DATACRAZY_E2E_WRITE === '1';
const skipRead = API_KEY ? false : 'DATACRAZY_API_KEY não definida';
const skipWrite = !API_KEY ? 'DATACRAZY_API_KEY não definida' : !WRITE ? 'DATACRAZY_E2E_WRITE != 1' : false;
const TIMEOUT_MS = 20_000;
const PREFIX = `n8n-e2e-${Date.now()}`;

async function httpRequest(options: any): Promise<any> {
	const response = await fetch(options.url, {
		method: options.method,
		headers: options.headers,
		body: options.body === undefined || options.method === 'GET' ? undefined : JSON.stringify(options.body),
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});
	const text = await response.text();
	if (!response.ok) {
		throw new Error(`${options.method} ${options.url} → ${response.status} ${text.slice(0, 300)}`);
	}
	return text ? JSON.parse(text) : {};
}

function param(params: Record<string, unknown>, name: string, fallback: unknown) {
	const value = name.split('.').reduce<any>((obj, key) => (obj == null ? undefined : obj[key]), params);
	if (value !== undefined) return value;
	if (fallback !== undefined) return fallback;
	throw new Error(`Parâmetro ausente: ${name}`);
}

async function exec(params: Record<string, unknown>): Promise<any> {
	const context = {
		getInputData: () => [{ json: {} }],
		getNodeParameter: (name: string, _i: number, fallback?: unknown) => param(params, name, fallback),
		getCredentials: async () => ({ apiKey: API_KEY }),
		getNode: () => ({ name: 'DataCrazy' }),
		continueOnFail: () => false,
		helpers: { request: httpRequest },
	} as unknown as IExecuteFunctions;
	const [output] = await new DataCrazy().execute.call(context);
	return output.length === 1 ? output[0].json : output.map((item) => item.json);
}

async function loadOptions(method: string, current: Record<string, unknown> = {}) {
	const context = {
		getCurrentNodeParameter: (name: string) => param(current, name, ''),
		getCredentials: async () => ({ apiKey: API_KEY }),
		getNode: () => ({ name: 'DataCrazy' }),
		helpers: { request: httpRequest },
	} as unknown as ILoadOptionsFunctions;
	return (new DataCrazy().methods.loadOptions as Record<string, Function>)[method].call(context);
}

function firstOf(response: any): any {
	const data = Array.isArray(response) ? response : response?.data;
	return Array.isArray(data) ? data[0] : undefined;
}

function assertPaginated(response: any) {
	assert.ok(Array.isArray(response?.data), `resposta sem data[]: ${JSON.stringify(response).slice(0, 200)}`);
}

describe('integração: leitura', { skip: skipRead }, () => {
	it('leads e sub-recursos', async (t) => {
		const leads = await exec({ resource: 'leads', operation: 'getAll', options: { take: 1 } });
		assertPaginated(leads);
		const lead = firstOf(leads);
		if (!lead) return t.skip('conta sem leads');

		await exec({ resource: 'leads', operation: 'get', leadId: lead.id });
		assertPaginated(await exec({ resource: 'leads', operation: 'getHistory', leadId: lead.id, subResourceOptions: { take: 5 } }));
		assertPaginated(await exec({ resource: 'leads', operation: 'getActivities', leadId: lead.id, subResourceOptions: { take: 5 } }));
		assertPaginated(await exec({ resource: 'leads', operation: 'getBusinesses', leadId: lead.id, subResourceOptions: { take: 5 } }));
		assertPaginated(await exec({ resource: 'annotations', operation: 'getAll', leadId: lead.id }));
		assertPaginated(await exec({ resource: 'attachments', operation: 'getAll', leadId: lead.id }));
	});

	it('leads com searchType e filtros novos', async () => {
		assertPaginated(
			await exec({
				resource: 'leads',
				operation: 'getAll',
				// A API exige busca com no mínimo 4 caracteres.
				options: { take: 1, search: 'joao', searchType: 'name', filters: [{ type: 'PERSON' }] },
			}),
		);
	});

	it('pipelines, estágios e negócios', async (t) => {
		const pipelines = await exec({ resource: 'pipelines', operation: 'getAll', take: 5, skip: 0, search: '' });
		assertPaginated(pipelines);
		const pipeline = firstOf(pipelines);
		if (!pipeline) return t.skip('conta sem pipelines');

		const detail = await exec({ resource: 'pipelines', operation: 'get', pipelineId: pipeline.id });
		assert.equal(detail.id, pipeline.id);
		const stagesOptions = await loadOptions('getStages', { pipelineId: pipeline.id });
		assert.ok(Array.isArray(stagesOptions));

		const deals = await exec({ resource: 'deals', operation: 'getAll', options: { take: 1 } });
		assertPaginated(deals);
		const deal = firstOf(deals);
		if (deal) {
			await exec({ resource: 'deals', operation: 'get', dealId: deal.id });
			assertPaginated(await exec({ resource: 'dealAttachments', operation: 'getAll', dealAttachmentDealId: deal.id }));
		}
		if (stagesOptions[0]) {
			assertPaginated(
				await exec({ resource: 'deals', operation: 'getByStage', stageId: stagesOptions[0].value, take: 1, skip: 0 }),
			);
		}
	});

	it('negócios com filtros', async () => {
		assertPaginated(
			await exec({
				resource: 'deals',
				operation: 'getAll',
				options: { take: 1, filters: [{ status: 'in_process', externalId: 'inexistente' }] },
			}),
		);
	});

	it('catálogo: tags, listas, produtos, motivos de perda', async () => {
		const tags = await exec({ resource: 'tags', operation: 'getAll' });
		const tag = firstOf(tags);
		if (tag) {
			await exec({ resource: 'tags', operation: 'get', tagId: tag.id });
			const count = await exec({ resource: 'tags', operation: 'getLeadsCount', tagId: tag.id });
			assert.equal(typeof count.count, 'number');
		}
		assertPaginated(await exec({ resource: 'lists', operation: 'getAll', listOptions: {} }));
		assertPaginated(await exec({ resource: 'products', operation: 'getAll', productOptions: {} }));
		assertPaginated(await exec({ resource: 'lossReasons', operation: 'getAll', lossReasonSkip: 0, lossReasonTake: 5 }));
		assert.ok(Array.isArray(await loadOptions('getLossReasons')));
	});

	it('conversas, conexões e atendentes', async () => {
		const conversations = await exec({
			resource: 'conversations',
			operation: 'getAll',
			options: { take: 1, filters: [{ openWindow: 'all' }] },
		});
		assertPaginated(conversations);
		const conversation = firstOf(conversations);
		if (conversation) await exec({ resource: 'conversations', operation: 'get', conversationId: conversation.id });

		const instances = await exec({ resource: 'instances', operation: 'getAll' });
		assertPaginated(instances);
		const instance = firstOf(instances);
		if (instance) await exec({ resource: 'instances', operation: 'get', instanceId: instance.id });

		const crm = await exec({ resource: 'attendants', operation: 'getAllCrm' });
		assertPaginated(crm);
		const crmAttendant = firstOf(crm);
		if (crmAttendant) await exec({ resource: 'attendants', operation: 'getCrm', attendantId: crmAttendant.id });

		const multi = await exec({ resource: 'attendants', operation: 'getAllMulti' });
		assertPaginated(multi);
		const multiAttendant = firstOf(multi);
		if (multiAttendant) await exec({ resource: 'attendants', operation: 'getMulti', attendantMultiId: multiAttendant.id });
	});

	it('atividades', async () => {
		assertPaginated(await exec({ resource: 'activities', operation: 'getAll', activityOptions: { take: 1 } }));
	});

	it('campos adicionais e departamentos (rotas de serviço no host público)', async () => {
		const leadFields = await exec({ resource: 'additionalFields', operation: 'getAll', scope: 'lead', options: {} });
		assert.ok(leadFields !== undefined);
		await exec({ resource: 'additionalFields', operation: 'getAll', scope: 'deal', options: {} });
		assert.ok(Array.isArray(await loadOptions('getDepartments')));
	});
});

describe('integração: escrita', { skip: skipWrite }, () => {
	const cleanup: Array<() => Promise<unknown>> = [];
	after(async () => {
		for (const undo of cleanup.reverse()) await undo().catch(() => undefined);
	});

	it('tag: create → update → get → delete', async () => {
		const tag = await exec({ resource: 'tags', operation: 'create', name: `${PREFIX}-tag`, color: '#A78BFA', additionalFields: {} });
		assert.ok(tag.id);
		cleanup.push(() => exec({ resource: 'tags', operation: 'delete', tagId: tag.id }));
		await exec({ resource: 'tags', operation: 'update', tagId: tag.id, additionalFields: { description: 'e2e' } });
		const fetched = await exec({ resource: 'tags', operation: 'get', tagId: tag.id });
		assert.equal(fetched.id, tag.id);
		await exec({ resource: 'tags', operation: 'delete', tagId: tag.id });
		cleanup.pop();
	});

	it('produto: create → update → delete', async () => {
		const name = `${PREFIX}-produto`;
		const created = await exec({
			resource: 'products',
			operation: 'create',
			productName: name,
			productPrice: 1.5,
			productAdditionalFields: { id_sku: `${PREFIX}-sku` },
		});
		const id = created.id ?? firstOf(await exec({ resource: 'products', operation: 'getAll', productOptions: { search: name } }))?.id;
		assert.ok(id, 'produto criado sem id');
		cleanup.push(() => exec({ resource: 'products', operation: 'delete', productId: id }));
		await exec({ resource: 'products', operation: 'update', productId: id, productAdditionalFields: { name, price: 2 } });
		await exec({ resource: 'products', operation: 'delete', productId: id });
		cleanup.pop();
	});

	it('lista: create → update → delete', async () => {
		const name = `${PREFIX}-lista`;
		const created = await exec({ resource: 'lists', operation: 'create', listName: name, listAdditionalFields: {} });
		const id = created.id ?? firstOf(await exec({ resource: 'lists', operation: 'getAll', listOptions: { search: name } }))?.id;
		assert.ok(id, 'lista criada sem id');
		cleanup.push(() => exec({ resource: 'lists', operation: 'delete', listId: id }));
		await exec({ resource: 'lists', operation: 'update', listId: id, listAdditionalFields: { name, description: 'e2e' } });
		await exec({ resource: 'lists', operation: 'delete', listId: id });
		cleanup.pop();
	});

	it('motivo de perda: create → update → delete', async () => {
		const reason = await exec({ resource: 'lossReasons', operation: 'create', lossReasonName: `${PREFIX}-motivo` });
		assert.ok(reason.id);
		cleanup.push(() => exec({ resource: 'lossReasons', operation: 'delete', lossReasonRecordId: reason.id }));
		await exec({
			resource: 'lossReasons',
			operation: 'update',
			lossReasonRecordId: reason.id,
			lossReasonUpdateFields: { requiredJustification: true },
		});
		await exec({ resource: 'lossReasons', operation: 'delete', lossReasonRecordId: reason.id });
		cleanup.pop();
	});

	it('lead: create → nota → atividade → negócio → delete', async () => {
		const lead = await exec({
			resource: 'leads',
			operation: 'create',
			name: `${PREFIX}-lead`,
			additionalFields: { type: 'PERSON', role: 'QA', notes: 'e2e' },
		});
		assert.ok(lead.id);
		cleanup.push(() => exec({ resource: 'leads', operation: 'delete', leadId: lead.id }));

		await exec({ resource: 'leads', operation: 'update', leadId: lead.id, name: `${PREFIX}-lead-2` });

		await exec({ resource: 'annotations', operation: 'create', leadId: lead.id, note: 'nota e2e' });
		const notes = await exec({ resource: 'annotations', operation: 'getAll', leadId: lead.id });
		const note = firstOf(notes);
		if (note) await exec({ resource: 'annotations', operation: 'delete', leadId: lead.id, noteId: note.id });

		const activity = await exec({
			resource: 'activities',
			operation: 'create',
			activityTitle: `${PREFIX}-atividade`,
			activityLeadId: lead.id,
			activityAdditionalFields: { startDate: new Date().toISOString() },
		});
		assert.ok(activity.id);
		cleanup.push(() => exec({ resource: 'activities', operation: 'delete', activityId: activity.id }));
		await exec({ resource: 'activities', operation: 'update', activityId: activity.id, activityAdditionalFields: { title: 'e2e' } });
		await exec({ resource: 'activities', operation: 'delete', activityId: activity.id });
		cleanup.pop();

		const pipeline = firstOf(await exec({ resource: 'pipelines', operation: 'getAll', take: 1, skip: 0, search: '' }));
		const stage = pipeline ? (await loadOptions('getStages', { pipelineId: pipeline.id }))[0] : undefined;
		if (stage) {
			const deal = await exec({
				resource: 'deals',
				operation: 'create',
				leadId: lead.id,
				pipelineId: pipeline.id,
				stageId: stage.value,
				attendantId: '',
			});
			assert.ok(deal.id);
			cleanup.push(() => exec({ resource: 'deals', operation: 'delete', dealId: deal.id }));
			await exec({ resource: 'dealActions', operation: 'win', ids: deal.id, additionalFields: {} });
			await exec({ resource: 'dealActions', operation: 'restore', ids: deal.id, additionalFields: {} });
			await exec({ resource: 'deals', operation: 'delete', dealId: deal.id });
			cleanup.pop();
		}

		await exec({ resource: 'leads', operation: 'delete', leadId: lead.id });
		cleanup.pop();
	});
});
