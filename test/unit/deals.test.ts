import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE, single } from '../helpers/context';

describe('deals', () => {
	it('create não envia pipelineId', async () => {
		const req = await single({
			resource: 'deals',
			operation: 'create',
			leadId: 'L',
			pipelineId: 'P',
			stageId: 'S',
			attendantId: 'A',
			additionalFields: { externalId: 'EXT' },
		});
		assert.equal(`${req.method} ${req.url}`, `POST ${BASE}/businesses`);
		assert.deepEqual(req.body, { leadId: 'L', stageId: 'S', attendantId: 'A', externalId: 'EXT' });
	});

	it('update não envia pipelineId', async () => {
		const req = await single({
			resource: 'deals',
			operation: 'update',
			dealId: 'D',
			leadId: 'L',
			pipelineId: 'P',
			stageId: 'S',
			attendantId: 'A',
		});
		assert.equal(`${req.method} ${req.url}`, `PATCH ${BASE}/businesses/D`);
		assert.deepEqual(req.body, { leadId: 'L', stageId: 'S', attendantId: 'A' });
	});

	it('get e delete usam o ID no path', async () => {
		const get = await single({ resource: 'deals', operation: 'get', dealId: 'D' });
		assert.equal(`${get.method} ${get.url}`, `GET ${BASE}/businesses/D`);
		const del = await single({ resource: 'deals', operation: 'delete', dealId: 'D' });
		assert.equal(`${del.method} ${del.url}`, `DELETE ${BASE}/businesses/D`);
	});

	it('getAll envia filtros, incluindo externalId', async () => {
		const req = await single({
			resource: 'deals',
			operation: 'getAll',
			options: {
				take: 10,
				search: 'x',
				filters: [{ externalId: 'E1', status: 'won', attendants: ['a1', 'a2'], minValue: 100 }],
			},
		});
		assert.equal(`${req.method} ${req.url}`, `GET ${BASE}/businesses`);
		assert.deepEqual(req.query, {
			take: '10',
			search: 'x',
			'filter[externalId]': 'E1',
			'filter[status]': 'won',
			'filter[attendants]': 'a1,a2',
			'filter[minValue]': '100',
		});
	});

	it('getByStage filtra pelo estágio com paginação', async () => {
		const req = await single({ resource: 'deals', operation: 'getByStage', stageId: 'S1', take: 25, skip: 50 });
		assert.equal(req.url, `${BASE}/businesses`);
		assert.deepEqual(req.query, { take: '25', skip: '50', 'filter[stage.id]': 'S1' });
	});
});

describe('dealActions', () => {
	it('move envia apenas ids e destinationStageId', async () => {
		const req = await single({
			resource: 'dealActions',
			operation: 'move',
			ids: 'd1, d2',
			destinationPipelineId: 'P',
			destinationStageId: 'S',
			additionalFields: {},
		});
		assert.equal(`${req.method} ${req.url}`, `POST ${BASE}/businesses/actions/move`);
		assert.deepEqual(req.body, { ids: ['d1', 'd2'], destinationStageId: 'S' });
	});

	it('move aceita ids em JSON', async () => {
		const req = await single({
			resource: 'dealActions',
			operation: 'move',
			ids: '["d1","d2"]',
			destinationStageId: 'S',
			additionalFields: {},
		});
		assert.deepEqual(req.body, { ids: ['d1', 'd2'], destinationStageId: 'S' });
	});

	it('win, lose e restore', async () => {
		const win = await single({ resource: 'dealActions', operation: 'win', ids: 'd1', additionalFields: {} });
		assert.equal(win.url, `${BASE}/businesses/actions/win`);
		assert.deepEqual(win.body, { ids: ['d1'] });

		const lose = await single({
			resource: 'dealActions',
			operation: 'lose',
			ids: 'd1',
			lossReasonId: 'R',
			justification: 'caro',
			additionalFields: {},
		});
		assert.equal(lose.url, `${BASE}/businesses/actions/lose`);
		assert.deepEqual(lose.body, { ids: ['d1'], lossReasonId: 'R', justification: 'caro' });

		const restore = await single({ resource: 'dealActions', operation: 'restore', ids: 'd1', additionalFields: {} });
		assert.equal(restore.url, `${BASE}/businesses/actions/restore`);
		assert.deepEqual(restore.body, { ids: ['d1'] });
	});
});
