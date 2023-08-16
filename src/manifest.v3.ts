export default {
    manifest_version: 3,
    name: "PogEXT",
    description: "Extension to simulate your own personal twitch chat in the browser",
    version: "1.0",
    content_scripts: [
        {
            matches: ["<all_urls>"],
            js: ["content/content.ts"],
            run_at: "document_idle"
        }
    ],
    icons: {
		'128': 'assets/icon_128.png',
		'48': 'assets/icon_48.png',
		'16': 'assets/icon_16.png',
	},
	options_page: 'pages/popup/index.html',
	action: {
		default_popup: 'pages/popup/index.html',
	},
    background: {
		service_worker: 'background.ts',
	},
	web_accessible_resources: [
		{
            resources: [
                'utils/emotes.ts',
                'assets/emotes/*.webp' // Allow access to all .webp files in the emotes folder
            ],
            matches: ['<all_urls>'],
        },
	],
    permissions: ["storage","activeTab","tabs"]
};