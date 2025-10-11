// N8N Community Node Entry Point
// This file ensures proper loading of the D-API node and credentials

module.exports = {
	// Export node classes
	nodes: [
		'dist/nodes/DataCrazy/DataCrazy.node.js'
	],
	// Export credential classes
	credentials: [
		'dist/credentials/DataCrazyCredentials.credentials.js'
	]
};