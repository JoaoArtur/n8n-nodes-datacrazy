import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE, single } from '../helpers/context';

describe('attachments (lead)', () => {
	it('getAll, create e delete', async () => {
		const list = await single({ resource: 'attachments', operation: 'getAll', leadId: 'L' });
		assert.equal(`${list.method} ${list.url}`, `GET ${BASE}/leads/L/attachments`);

		const create = await single({
			resource: 'attachments',
			operation: 'create',
			leadId: 'L',
			attachmentUrl: 'https://x/a.png',
			fileName: 'a.png',
			fileSize: 100,
			description: 'foto',
		});
		assert.equal(`${create.method} ${create.url}`, `POST ${BASE}/leads/L/attachments`);
		assert.deepEqual(create.body, { attachmentUrl: 'https://x/a.png', fileName: 'a.png', fileSize: 100, description: 'foto' });

		const del = await single({ resource: 'attachments', operation: 'delete', leadId: 'L', attachmentId: 'AT' });
		assert.equal(`${del.method} ${del.url}`, `DELETE ${BASE}/leads/L/attachments/AT`);
	});

	// A API exige fileSize (ausente no OpenAPI); sem ele retorna erro do Prisma.
	it('create envia fileSize', async () => {
		const req = await single({
			resource: 'attachments',
			operation: 'create',
			leadId: 'L',
			attachmentUrl: 'u',
			fileName: 'f',
			fileSize: 123,
		});
		assert.deepEqual(req.body, { attachmentUrl: 'u', fileName: 'f', fileSize: 123 });
	});
});

describe('annotations (lead)', () => {
	it('CRUD de notas', async () => {
		const list = await single({ resource: 'annotations', operation: 'getAll', leadId: 'L' });
		assert.equal(`${list.method} ${list.url}`, `GET ${BASE}/leads/L/notes`);

		const create = await single({ resource: 'annotations', operation: 'create', leadId: 'L', note: 'oi' });
		assert.equal(`${create.method} ${create.url}`, `POST ${BASE}/leads/L/notes`);
		assert.deepEqual(create.body, { note: 'oi' });

		const update = await single({ resource: 'annotations', operation: 'update', leadId: 'L', noteId: 'N', note: 'x' });
		assert.equal(`${update.method} ${update.url}`, `PUT ${BASE}/leads/L/notes/N`);
		assert.deepEqual(update.body, { note: 'x' });

		const del = await single({ resource: 'annotations', operation: 'delete', leadId: 'L', noteId: 'N' });
		assert.equal(`${del.method} ${del.url}`, `DELETE ${BASE}/leads/L/notes/N`);
	});
});
