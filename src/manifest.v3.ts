export default {
    manifest_version: 3,
    name: "PogEXT",
    description: "Chat Overlay Extension",
    version: "1.0",
    content_scripts: [
        {
            matches: ["<all_urls>"],
            js: ["content/content.ts"] // Point to the TypeScript file
        }
    ],
	options_page: 'pages/popup/index.html',
	action: {
		default_popup: 'pages/popup/index.html',
	},
    background: {
		service_worker: 'background.ts',
	},
	web_accessible_resources: [
		{
			resources: ['pages/popup/popup.ts'],
			matches: ['*://*.twitter.com/*'],
		},
	],
    permissions: ["activeTab"]
};
