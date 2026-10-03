import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE, runNode, single } from '../helpers/context';

describe('activities', () => {
	it('getAll envia paginação e filtros', async () => {
		const req = await single({
			resource: 'activities',
			operation: 'getAll',
			activityOptions: {
				take: 5,
				filters: { attendantId: 'A', isCompleted: false, startDate: '2026-01-01T00:00:00.000Z' },
			},
		});
		assert.equal(`${req.method} ${req.url}`, `GET ${BASE}/activities`);
		assert.deepEqual(req.query, {
			take: '5',
			'filter[attendantId]': 'A',
			'filter[isCompleted]': 'false',
			'filter[startDate]': '2026-01-01T00:00:00.000Z',
		});
	});

	it('create monta referências e normaliza datas', async () => {
		const req = await single({
			resource: 'activities',
			operation: 'create',
			activityTitle: 'Ligar',
			activityLeadId: 'L',
			activityAdditionalFields: {
				attendantId: 'A',
				businessId: 'B',
				activityTypeId: 'TY',
				startDate: '2026-01-01T10:00:00.000Z',
				required: true,
			},
		});
		assert.equal(`${req.method} ${req.url}`, `POST ${BASE}/activities`);
		assert.deepEqual(req.body, {
			title: 'Ligar',
			startDate: '2026-01-01T10:00:00.000Z',
			required: true,
			lead: { id: 'L' },
			attendant: { id: 'A' },
			business: { id: 'B' },
			activityType: { id: 'TY' },
		});
	});

	it('get, update e delete', async () => {
		const get = await single({ resource: 'activities', operation: 'get', activityId: 'X' });
		assert.equal(`${get.method} ${get.url}`, `GET ${BASE}/activities/X`);

		const update = await single({
			resource: 'activities',
			operation: 'update',
			activityId: 'X',
			activityAdditionalFields: { title: 'Novo' },
		});
		assert.equal(`${update.method} ${update.url}`, `PATCH ${BASE}/activities/X`);
		assert.deepEqual(update.body, { title: 'Novo' });

		const del = await single({ resource: 'activities', operation: 'delete', activityId: 'X' });
		assert.equal(`${del.method} ${del.url}`, `DELETE ${BASE}/activities/X`);
	});
});

describe('dealAttachments', () => {
	it('getAll, create e delete em lote', async () => {
		const list = await single({ resource: 'dealAttachments', operation: 'getAll', dealAttachmentDealId: 'B' });
		assert.equal(`${list.method} ${list.url}`, `GET ${BASE}/business/B/attachments`);

		const create = await single({
			resource: 'dealAttachments',
			operation: 'create',
			dealAttachmentDealId: 'B',
			dealAttachmentUrl: 'https://x/c.pdf',
			dealAttachmentFileName: 'c.pdf',
		});
		assert.equal(`${create.method} ${create.url}`, `POST ${BASE}/business/B/attachments`);
		assert.deepEqual(create.body, { attachmentUrl: 'https://x/c.pdf', fileName: 'c.pdf' });

		const del = await single({
			resource: 'dealAttachments',
			operation: 'delete',
			dealAttachmentDealId: 'B',
			dealAttachmentIds: ' a1, a2 ,',
		});
		assert.equal(`${del.method} ${del.url}`, `DELETE ${BASE}/business/B/attachments/batch`);
		assert.deepEqual(del.body, ['a1', 'a2']);
	});

	it('delete sem IDs falha sem chamar a API', async () => {
		await assert.rejects(
			runNode({ resource: 'dealAttachments', operation: 'delete', dealAttachmentDealId: 'B', dealAttachmentIds: ' , ' }),
			/ao menos um ID/,
		);
	});
});

describe('pipelines', () => {
	it('getAll respeita take/skip/search e não envia filter[all]', async () => {
		const req = await single({ resource: 'pipelines', operation: 'getAll', take: 10, skip: 5, search: 'vendas' });
		assert.equal(`${req.method} ${req.url}`, `GET ${BASE}/pipelines`);
		assert.deepEqual(req.query, { take: '10', skip: '5', search: 'vendas' });
	});

	it('get e getStages', async () => {
		const get = await single({ resource: 'pipelines', operation: 'get', pipelineId: 'P' });
		assert.equal(`${get.method} ${get.url}`, `GET ${BASE}/pipelines/P`);
		const stages = await single({ resource: 'pipelines', operation: 'getStages', pipelineId: 'P' });
		assert.equal(`${stages.method} ${stages.url}`, `GET ${BASE}/pipelines/P/stages`);
	});
});

describe('instances e attendants', () => {
	it('instances getAll e get', async () => {
		const list = await single({ resource: 'instances', operation: 'getAll' });
		assert.equal(`${list.method} ${list.url}`, `GET ${BASE}/instances`);
		const get = await single({ resource: 'instances', operation: 'get', instanceId: 'I' });
		assert.equal(`${get.method} ${get.url}`, `GET ${BASE}/instances/I`);
	});

	it('attendants CRM e multiatendimento', async () => {
		const crm = await single({ resource: 'attendants', operation: 'getAllCrm' });
		assert.equal(crm.url, `${BASE}/attendants/crm`);
		const crmOne = await single({ resource: 'attendants', operation: 'getCrm', attendantId: 'A' });
		assert.equal(crmOne.url, `${BASE}/attendants/crm/A`);
		const multi = await single({ resource: 'attendants', operation: 'getAllMulti', attendantMultiSearch: 'jo' });
		assert.equal(multi.url, `${BASE}/attendants/multi`);
		assert.deepEqual(multi.query, { search: 'jo' });
		const multiOne = await single({ resource: 'attendants', operation: 'getMulti', attendantMultiId: 'M' });
		assert.equal(multiOne.url, `${BASE}/attendants/multi/M`);
	});
});

describe('additionalFields (serviço CRM via gateway /api/v1/crm)', () => {
	it('getAll por escopo', async () => {
		const req = await single({ resource: 'additionalFields', operation: 'getAll', scope: 'deal', options: {} });
		assert.equal(`${req.method} ${req.url}`, `GET ${BASE}/crm/additionalFields`);
		assert.deepEqual(req.query, { skip: '0', take: '500', 'filter[entity]': 'business' });
	});

	it('setValue', async () => {
		const req = await single({
			resource: 'additionalFields',
			operation: 'setValue',
			scope: 'lead',
			leadId: 'L',
			additionalFieldId: 'F',
			value: 'v',
		});
		assert.equal(`${req.method} ${req.url}`, `PUT ${BASE}/crm/additional-fields/lead/L/F`);
		assert.deepEqual(req.body, { value: 'v' });
	});
});
