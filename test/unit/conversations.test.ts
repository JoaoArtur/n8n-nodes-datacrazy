import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BASE, single } from '../helpers/context';

describe('conversations', () => {
	it('getAll mapeia filtros da UI para os nomes da API pública', async () => {
		const req = await single({
			resource: 'conversations',
			operation: 'getAll',
			options: {
				take: 10,
				pipeline: 'P',
				stages: 'S',
				filters: [
					{
						department: 'D1,D2',
						instanceId: ['i1', 'i2'],
						attendant: 'A',
						tags: ['t1'],
						status: 'waiting',
						openWindow: 'last24h',
					},
				],
			},
		});
		assert.equal(`${req.method} ${req.url}`, `GET ${BASE}/conversations`);
		assert.deepEqual(req.query, {
			take: '10',
			'filter[stages]': 'S',
			'filter[departments]': 'D1,D2',
			'filter[instances]': 'i1,i2',
			'filter[attendants]': 'A',
			'filter[tags]': 't1',
			'filter[status]': 'waiting',
			'filter[openWindow]': 'last24h',
		});
	});

	it('getAll descarta o filtro legado initialized', async () => {
		const req = await single({
			resource: 'conversations',
			operation: 'getAll',
			options: { filters: [{ initialized: true }] },
		});
		assert.deepEqual(req.query, {});
	});

	it('get busca as mensagens da conversa', async () => {
		const req = await single({ resource: 'conversations', operation: 'get', conversationId: 'C' });
		assert.equal(`${req.method} ${req.url}`, `GET ${BASE}/conversations/C/messages`);
	});

	it('sendMessage de texto', async () => {
		const req = await single({
			resource: 'conversations',
			operation: 'sendMessage',
			conversationId: 'C',
			messageType: 'TEXT',
			body: 'Olá',
			additionalFields: { repliedMessageId: 'M1', isInternal: true, scheduledDate: '2026-01-01T12:00:00.000Z' },
		});
		assert.equal(`${req.method} ${req.url}`, `POST ${BASE}/conversations/C/messages`);
		assert.deepEqual(req.body, {
			body: 'Olá',
			isInternal: true,
			repliedMessageId: 'M1',
			scheduledDate: '2026-01-01T12:00:00.000Z',
		});
	});

	it('sendMessage de mídia envia o anexo com size', async () => {
		const req = await single({
			resource: 'conversations',
			operation: 'sendMessage',
			conversationId: 'C',
			messageType: 'FILE',
			attachmentUrl: 'https://x/doc.pdf',
			fileName: 'doc.pdf',
			fileSize: 2048,
			body: 'segue',
			additionalFields: {},
		});
		assert.deepEqual(req.body, {
			attachments: [
				{ file: {}, fileName: 'doc.pdf', mimeType: 'application/pdf', type: 'FILE', url: 'https://x/doc.pdf', size: 2048 },
			],
			isInternal: false,
			body: 'segue',
		});
	});

	it('finish usa a rota pública', async () => {
		const req = await single({ resource: 'conversations', operation: 'finish', conversationId: 'C' });
		assert.equal(`${req.method} ${req.url}`, `POST ${BASE}/conversations/C/finish`);
	});
});
