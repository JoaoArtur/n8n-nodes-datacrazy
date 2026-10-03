/**
 * Testes contra a API real. Exigem DATACRAZY_API_KEY no ambiente.
 * Operações de escrita só rodam com DATACRAZY_E2E_WRITE=1 e atuam apenas sobre registros
 * criados pelo próprio teste (prefixo n8n-e2e-), removidos ao final.
 */
import { after, describe, it, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import type { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { DataCrazy } from '../../nodes/DataCrazy/DataCrazy.node';

const API_KEY = process.env.DATACRAZY_API_KEY;
const WRITE = process.env.DATACRAZY_E2E_WRITE === '1';
const skipRead = API_KEY ? false : 'DATACRAZY_API_KEY não definida';
const skipWrite = !API_KEY ? 'DATACRAZY_API_KEY não definida' : !WRITE ? 'DATACRAZY_E2E_WRITE != 1' : false;
const TIMEOUT_MS = 20_000;
const PREFIX = `n8n-e2e-${Date.now()}`;
const SAMPLE_FILE_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
const SAMPLE_FILE_SIZE = 13264;

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

function idOf(response: any): string {
	assert.ok(response?.id, `resposta sem id: ${JSON.stringify(response).slice(0, 200)}`);
	return response.id;
}

/** Marca o teste como skipped quando falta um pré-requisito; devolve true se deve parar. */
function missing(t: TestContext, value: unknown, reason: string): boolean {
	if (value) return false;
	t.skip(reason);
	return true;
}

describe('integração: leitura', { skip: skipRead }, () => {
	const state: { lead?: any; pipeline?: any; stage?: any; deal?: any } = {};

	it('leads: listar', async () => {
		const leads = await exec({ resource: 'leads', operation: 'getAll', options: { take: 1 } });
		assertPaginated(leads);
		state.lead = firstOf(leads);
	});

	it('leads: listar com searchType e filtros novos', async () => {
		// A API exige busca com no mínimo 4 caracteres.
		assertPaginated(
			await exec({
				resource: 'leads',
				operation: 'getAll',
				options: { take: 1, search: 'joao', searchType: 'name', filters: [{ type: 'PERSON', excludeIds: 'x' }] },
			}),
		);
	});

	it('leads: buscar por ID e sub-recursos', async (t) => {
		if (missing(t, state.lead, 'conta sem leads')) return;
		const id = state.lead.id;
		assert.equal((await exec({ resource: 'leads', operation: 'get', leadId: id })) !== undefined, true);
		for (const operation of ['getHistory', 'getActivities', 'getBusinesses']) {
			assertPaginated(await exec({ resource: 'leads', operation, leadId: id, subResourceOptions: { take: 5 } }));
		}
		assertPaginated(await exec({ resource: 'annotations', operation: 'getAll', leadId: id }));
		assertPaginated(await exec({ resource: 'attachments', operation: 'getAll', leadId: id }));
	});

	it('pipelines: listar e buscar por ID', async (t) => {
		const pipelines = await exec({ resource: 'pipelines', operation: 'getAll', take: 5, skip: 0, search: '' });
		assertPaginated(pipelines);
		state.pipeline = firstOf(pipelines);
		if (missing(t, state.pipeline, 'conta sem pipelines')) return;
		assert.equal((await exec({ resource: 'pipelines', operation: 'get', pipelineId: state.pipeline.id })).id, state.pipeline.id);
	});

	it('pipelines: listar estágios', async (t) => {
		if (missing(t, state.pipeline, 'conta sem pipelines')) return;
		assertPaginated(await exec({ resource: 'pipelines', operation: 'getStages', pipelineId: state.pipeline.id }));
		const options = await loadOptions('getStages', { pipelineId: state.pipeline.id });
		assert.ok(Array.isArray(options));
		state.stage = options[0];
	});

	it('negócios: listar com filtros', async () => {
		const deals = await exec({
			resource: 'deals',
			operation: 'getAll',
			options: { take: 1, filters: [{ status: 'in_process', attendants: [] }] },
		});
		assertPaginated(deals);
		state.deal = firstOf(deals);
	});

	it('negócios: listar por estágio', async (t) => {
		if (missing(t, state.stage, 'pipeline sem estágios')) return;
		assertPaginated(await exec({ resource: 'deals', operation: 'getByStage', stageId: state.stage.value, take: 1, skip: 0 }));
	});

	it('negócios: buscar por ID e anexos', async (t) => {
		if (missing(t, state.deal, 'conta sem negócios (coberto na suíte de escrita)')) return;
		assert.equal((await exec({ resource: 'deals', operation: 'get', dealId: state.deal.id })).id, state.deal.id);
		assertPaginated(await exec({ resource: 'dealAttachments', operation: 'getAll', dealAttachmentDealId: state.deal.id }));
	});

	it('tags: listar, buscar e contar leads', async (t) => {
		const tag = firstOf(await exec({ resource: 'tags', operation: 'getAll' }));
		if (missing(t, tag, 'conta sem tags (coberto na suíte de escrita)')) return;
		assert.equal((await exec({ resource: 'tags', operation: 'get', tagId: tag.id })).id, tag.id);
		assert.equal(typeof (await exec({ resource: 'tags', operation: 'getLeadsCount', tagId: tag.id })).count, 'number');
	});

	for (const [resource, extra] of [
		['lists', { listOptions: {} }],
		['products', { productOptions: {} }],
		['lossReasons', { lossReasonSkip: 0, lossReasonTake: 5 }],
		['activities', { activityOptions: { take: 1 } }],
	] as const) {
		it(`${resource}: listar`, async () => {
			assertPaginated(await exec({ resource, operation: 'getAll', ...extra }));
		});
	}

	it('conversas: listar e mensagens', async (t) => {
		const conversations = await exec({
			resource: 'conversations',
			operation: 'getAll',
			options: { take: 1, filters: [{ openWindow: 'all' }] },
		});
		assertPaginated(conversations);
		const conversation = firstOf(conversations);
		if (missing(t, conversation, 'conta sem conversas')) return;
		await exec({ resource: 'conversations', operation: 'get', conversationId: conversation.id });
	});

	it('conexões: listar e buscar por ID', async (t) => {
		const instances = await exec({ resource: 'instances', operation: 'getAll' });
		assertPaginated(instances);
		const instance = firstOf(instances);
		if (missing(t, instance, 'conta sem conexões')) return;
		assert.equal((await exec({ resource: 'instances', operation: 'get', instanceId: instance.id })).id, instance.id);
	});

	it('atendentes CRM: listar e buscar por ID', async (t) => {
		const list = await exec({ resource: 'attendants', operation: 'getAllCrm' });
		assertPaginated(list);
		const attendant = firstOf(list);
		if (missing(t, attendant, 'conta sem atendentes CRM')) return;
		assert.equal((await exec({ resource: 'attendants', operation: 'getCrm', attendantId: attendant.id })).id, attendant.id);
	});

	it('atendentes multiatendimento: listar e buscar por ID', async (t) => {
		const list = await exec({ resource: 'attendants', operation: 'getAllMulti' });
		assertPaginated(list);
		const attendant = firstOf(list);
		if (missing(t, attendant, 'conta sem atendentes multiatendimento')) return;
		await exec({ resource: 'attendants', operation: 'getMulti', attendantMultiId: attendant.id });
	});

	it('campos adicionais: lead e negócio', async () => {
		assert.ok(Array.isArray(await exec({ resource: 'additionalFields', operation: 'getAll', scope: 'lead', options: {} })));
		const dealFields = await exec({ resource: 'additionalFields', operation: 'getAll', scope: 'deal', options: {} });
		assert.ok(dealFields !== undefined);
	});

	for (const method of ['getPipelines', 'getTags', 'getAttendants', 'getInstances', 'getLossReasons', 'getDepartments']) {
		it(`loadOptions: ${method}`, async () => {
			assert.ok(Array.isArray(await loadOptions(method)));
		});
	}
});

describe('integração: escrita', { skip: skipWrite }, () => {
	const cleanup = new Map<string, () => Promise<unknown>>();
	const track = (key: string, undo: () => Promise<unknown>) => cleanup.set(key, undo);
	const untrack = (key: string) => cleanup.delete(key);
	after(async () => {
		for (const undo of [...cleanup.values()].reverse()) await undo().catch(() => undefined);
	});

	const fake: { leadId?: string; dealId?: string; externalId?: string; stages: any[]; attendantId?: string } = { stages: [] };

	describe('catálogo', () => {
		it('tags: criar, buscar, atualizar, contar leads e excluir', async () => {
			const id = idOf(
				await exec({ resource: 'tags', operation: 'create', name: `${PREFIX}-tag`, color: '#A78BFA', additionalFields: {} }),
			);
			track('tag', () => exec({ resource: 'tags', operation: 'delete', tagId: id }));
			assert.equal((await exec({ resource: 'tags', operation: 'get', tagId: id })).id, id);
			await exec({ resource: 'tags', operation: 'update', tagId: id, additionalFields: { description: 'e2e' } });
			assert.equal((await exec({ resource: 'tags', operation: 'getLeadsCount', tagId: id })).count, 0);
			await exec({ resource: 'tags', operation: 'delete', tagId: id });
			untrack('tag');
		});

		it('listas: criar, buscar, atualizar e excluir', async () => {
			const name = `${PREFIX}-lista`;
			const created = await exec({ resource: 'lists', operation: 'create', listName: name, listAdditionalFields: {} });
			const id = created.id ?? firstOf(await exec({ resource: 'lists', operation: 'getAll', listOptions: { search: name } }))?.id;
			assert.ok(id, 'lista criada sem id');
			track('list', () => exec({ resource: 'lists', operation: 'delete', listId: id }));
			assert.equal((await exec({ resource: 'lists', operation: 'get', listId: id })).id, id);
			await exec({ resource: 'lists', operation: 'update', listId: id, listAdditionalFields: { name, description: 'e2e' } });
			await exec({ resource: 'lists', operation: 'delete', listId: id });
			untrack('list');
		});

		it('produtos: criar, buscar, atualizar e excluir', async () => {
			const name = `${PREFIX}-produto`;
			const created = await exec({
				resource: 'products',
				operation: 'create',
				productName: name,
				productPrice: 1.5,
				productAdditionalFields: { id_sku: `${PREFIX}-sku` },
			});
			const id =
				created.id ?? firstOf(await exec({ resource: 'products', operation: 'getAll', productOptions: { search: name } }))?.id;
			assert.ok(id, 'produto criado sem id');
			track('product', () => exec({ resource: 'products', operation: 'delete', productId: id }));
			assert.equal((await exec({ resource: 'products', operation: 'get', productId: id })).id, id);
			await exec({ resource: 'products', operation: 'update', productId: id, productAdditionalFields: { name, price: 2 } });
			await exec({ resource: 'products', operation: 'delete', productId: id });
			untrack('product');
		});

		it('motivos de perda: criar, buscar, atualizar e excluir', async () => {
			const id = idOf(await exec({ resource: 'lossReasons', operation: 'create', lossReasonName: `${PREFIX}-motivo` }));
			track('lossReason', () => exec({ resource: 'lossReasons', operation: 'delete', lossReasonRecordId: id }));
			assert.equal((await exec({ resource: 'lossReasons', operation: 'get', lossReasonRecordId: id })).id, id);
			await exec({
				resource: 'lossReasons',
				operation: 'update',
				lossReasonRecordId: id,
				lossReasonUpdateFields: { requiredJustification: true },
			});
			await exec({ resource: 'lossReasons', operation: 'delete', lossReasonRecordId: id });
			untrack('lossReason');
		});
	});

	describe('fluxo com lead e negócio fake', () => {
		it('lead: criar com campos novos e buscar', async () => {
			const id = idOf(
				await exec({
					resource: 'leads',
					operation: 'create',
					name: `${PREFIX}-lead`,
					email: `${PREFIX}@example.com`,
					additionalFields: { type: 'PERSON', role: 'QA', sector: 'Testes', notes: 'e2e' },
				}),
			);
			fake.leadId = id;
			track('lead', () => exec({ resource: 'leads', operation: 'delete', leadId: id }));
			const lead = firstOf(await exec({ resource: 'leads', operation: 'get', leadId: id })) ?? (await exec({ resource: 'leads', operation: 'get', leadId: id }));
			assert.equal(lead.id, id);
			assert.equal(lead.role, 'QA');
		});

		it('lead: atualizar', async (t) => {
			if (missing(t, fake.leadId, 'lead não criado')) return;
			const updated = await exec({ resource: 'leads', operation: 'update', leadId: fake.leadId, name: `${PREFIX}-lead-2` });
			assert.equal(updated.name, `${PREFIX}-lead-2`);
		});

		it('notas: criar, listar, atualizar e excluir', async (t) => {
			if (missing(t, fake.leadId, 'lead não criado')) return;
			const leadId = fake.leadId!;
			await exec({ resource: 'annotations', operation: 'create', leadId, note: 'nota e2e' });
			const note = firstOf(await exec({ resource: 'annotations', operation: 'getAll', leadId }));
			assert.ok(note?.id, 'nota não encontrada após criar');
			await exec({ resource: 'annotations', operation: 'update', leadId, noteId: note.id, note: 'nota e2e editada' });
			await exec({ resource: 'annotations', operation: 'delete', leadId, noteId: note.id });
		});

		it('anexos do lead: anexar, listar e excluir', async (t) => {
			if (missing(t, fake.leadId, 'lead não criado')) return;
			const leadId = fake.leadId!;
			const id = idOf(
				await exec({
					resource: 'attachments',
					operation: 'create',
					leadId,
					attachmentUrl: SAMPLE_FILE_URL,
					fileName: 'e2e.pdf',
					fileSize: SAMPLE_FILE_SIZE,
				}),
			);
			const list = await exec({ resource: 'attachments', operation: 'getAll', leadId });
			assert.ok(list.data.some((a: any) => a.id === id));
			await exec({ resource: 'attachments', operation: 'delete', leadId, attachmentId: id });
		});

		it('campos adicionais: gravar valor no lead', async (t) => {
			if (missing(t, fake.leadId, 'lead não criado')) return;
			const fields = await exec({ resource: 'additionalFields', operation: 'getAll', scope: 'lead', options: {} });
			const field = (Array.isArray(fields) ? fields : []).find((f: any) => f.type === 'string');
			if (missing(t, field, 'nenhum campo adicional de texto para lead')) return;
			await exec({
				resource: 'additionalFields',
				operation: 'setValue',
				scope: 'lead',
				leadId: fake.leadId,
				additionalFieldId: field.id,
				value: 'e2e',
			});
		});

		it('atividades: criar, buscar, atualizar, listar no lead e excluir', async (t) => {
			if (missing(t, fake.leadId, 'lead não criado')) return;
			const id = idOf(
				await exec({
					resource: 'activities',
					operation: 'create',
					activityTitle: `${PREFIX}-atividade`,
					activityLeadId: fake.leadId,
					activityStartDate: new Date().toISOString(),
					activityEndDate: new Date(Date.now() + 3_600_000).toISOString(),
					activityAdditionalFields: { description: 'e2e' },
				}),
			);
			track('activity', () => exec({ resource: 'activities', operation: 'delete', activityId: id }));
			assert.equal((await exec({ resource: 'activities', operation: 'get', activityId: id })).id, id);
			await exec({ resource: 'activities', operation: 'update', activityId: id, activityAdditionalFields: { title: `${PREFIX}-2` } });
			const leadActivities = await exec({ resource: 'leads', operation: 'getActivities', leadId: fake.leadId, subResourceOptions: {} });
			assert.ok(leadActivities.data.some((a: any) => a.id === id));
			await exec({ resource: 'activities', operation: 'delete', activityId: id });
			untrack('activity');
		});

		it('negócio: criar, buscar e atualizar', async (t) => {
			if (missing(t, fake.leadId, 'lead não criado')) return;
			const pipeline = firstOf(await exec({ resource: 'pipelines', operation: 'getAll', take: 50, skip: 0, search: '' }));
			if (missing(t, pipeline, 'conta sem pipelines')) return;
			fake.stages = await loadOptions('getStages', { pipelineId: pipeline.id });
			if (missing(t, fake.stages[0], 'pipeline sem estágios')) return;
			fake.attendantId = firstOf(await exec({ resource: 'attendants', operation: 'getAllCrm' }))?.id;

			const id = idOf(
				await exec({
					resource: 'deals',
					operation: 'create',
					leadId: fake.leadId,
					pipelineId: pipeline.id,
					stageId: fake.stages[0].value,
					attendantId: fake.attendantId ?? '',
				}),
			);
			fake.dealId = id;
			track('deal', () => exec({ resource: 'deals', operation: 'delete', dealId: id }));

			assert.equal((await exec({ resource: 'deals', operation: 'get', dealId: id })).id, id);
			const externalId = `${PREFIX}-ext`;
			await exec({ resource: 'deals', operation: 'update', dealId: id, leadId: fake.leadId, pipelineId: pipeline.id, stageId: fake.stages[0].value, attendantId: fake.attendantId ?? '', additionalFields: { externalId } });
			assert.equal((await exec({ resource: 'deals', operation: 'get', dealId: id })).externalId, externalId);
			fake.externalId = externalId;
			const byStage = await exec({ resource: 'deals', operation: 'getByStage', stageId: fake.stages[0].value, take: 100, skip: 0 });
			assertPaginated(byStage);
		});

		it(
			'negócio: filtrar por externalId',
			{ todo: 'a API retorna count 0 mesmo com o externalId gravado no negócio' },
			async (t) => {
				if (missing(t, fake.externalId, 'negócio não criado')) return;
				const filtered = await exec({ resource: 'deals', operation: 'getAll', options: { filters: [{ externalId: fake.externalId }] } });
				assert.ok(filtered.data.some((d: any) => d.id === fake.dealId), 'filtro externalId não encontrou o negócio');
			},
		);

		it(
			'lead: listar negócios do lead',
			{ todo: 'a API retorna data [] mesmo com negócio criado para o lead' },
			async (t) => {
				if (missing(t, fake.dealId, 'negócio não criado')) return;
				const leadDeals = await exec({ resource: 'leads', operation: 'getBusinesses', leadId: fake.leadId, subResourceOptions: {} });
				assert.ok(leadDeals.data.some((d: any) => d.id === fake.dealId), 'negócio não aparece nos negócios do lead');
			},
		);

		it('ações: mover de estágio', async (t) => {
			if (missing(t, fake.dealId, 'negócio não criado')) return;
			if (missing(t, fake.stages[1], 'pipeline com menos de 2 estágios')) return;
			await exec({ resource: 'dealActions', operation: 'move', ids: fake.dealId, destinationStageId: fake.stages[1].value, additionalFields: {} });
			assert.equal((await exec({ resource: 'deals', operation: 'get', dealId: fake.dealId })).stageId, fake.stages[1].value);
		});

		it('anexos do negócio: anexar, listar e excluir em lote', async (t) => {
			if (missing(t, fake.dealId, 'negócio não criado')) return;
			const dealId = fake.dealId!;
			const id = idOf(
				await exec({
					resource: 'dealAttachments',
					operation: 'create',
					dealAttachmentDealId: dealId,
					dealAttachmentUrl: SAMPLE_FILE_URL,
					dealAttachmentFileName: 'e2e.pdf',
					dealAttachmentFileSize: SAMPLE_FILE_SIZE,
				}),
			);
			const list = await exec({ resource: 'dealAttachments', operation: 'getAll', dealAttachmentDealId: dealId });
			assert.ok(list.data.some((a: any) => a.id === id));
			await exec({ resource: 'dealAttachments', operation: 'delete', dealAttachmentDealId: dealId, dealAttachmentIds: id });
		});

		it('ações: ganhar e restaurar', async (t) => {
			if (missing(t, fake.dealId, 'negócio não criado')) return;
			await exec({ resource: 'dealActions', operation: 'win', ids: fake.dealId, additionalFields: {} });
			assert.equal((await exec({ resource: 'deals', operation: 'get', dealId: fake.dealId })).status, 'won');
			await exec({ resource: 'dealActions', operation: 'restore', ids: fake.dealId, additionalFields: {} });
		});

		it('ações: perder com motivo e restaurar', async (t) => {
			if (missing(t, fake.dealId, 'negócio não criado')) return;
			const reasonId = idOf(await exec({ resource: 'lossReasons', operation: 'create', lossReasonName: `${PREFIX}-perda` }));
			track('lossReasonForDeal', () => exec({ resource: 'lossReasons', operation: 'delete', lossReasonRecordId: reasonId }));
			await exec({
				resource: 'dealActions',
				operation: 'lose',
				ids: fake.dealId,
				lossReasonId: reasonId,
				justification: 'e2e',
				additionalFields: {},
			});
			assert.equal((await exec({ resource: 'deals', operation: 'get', dealId: fake.dealId })).lossReasonId, reasonId);
			await exec({ resource: 'dealActions', operation: 'restore', ids: fake.dealId, additionalFields: {} });
		});

		it('negócio e lead: excluir', async (t) => {
			if (missing(t, fake.leadId, 'lead não criado')) return;
			if (fake.dealId) {
				await exec({ resource: 'deals', operation: 'delete', dealId: fake.dealId });
				untrack('deal');
			}
			await exec({ resource: 'leads', operation: 'delete', leadId: fake.leadId });
			untrack('lead');
		});

		it.skip('conversas: enviar mensagem e finalizar (lead fake não tem conversa; coberto só nos unitários)');
	});
});
