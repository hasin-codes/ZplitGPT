const fs = require('fs');
const path = require('path');
const Bytez = require('bytez.js');

async function test() {
    console.log('Testing Bytez API...');

    // Read .env.local manually
    let key = '';
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/BYTEZ_API_KEY=["']?([^"'\n]+)["']?/);
        if (match) {
            key = match[1];
        }
    } catch (e) {
        console.error('Failed to read .env.local:', e.message);
    }

    console.log('API Key present:', !!key);

    if (!key) {
        console.error('No API key found!');
        return;
    }

    try {
        const sdk = new Bytez(key);
        const models = [
            'Qwen/Qwen2.5-3B-Instruct'
        ];

        const input = [
            { role: 'user', content: 'Hello, say hi!' }
        ];

        console.log('Running inference on models:', models);

        const promises = models.map(async (id) => {
            try {
                console.log(`Starting ${id}...`);
                const model = sdk.model(id);
                const result = await model.run(input);
                console.log(`Finished ${id}:`, result.error ? `Error: ${result.error}` : 'Success');
                return { id, result };
            } catch (e) {
                console.error(`CRASHED ${id}:`, e);
                return { id, error: e.message };
            }
        });

        const results = await Promise.all(promises);
        console.log('All results:', JSON.stringify(results, null, 2));

    } catch (error) {
        console.error('Error running Bytez:', error);
    }
}

test();
