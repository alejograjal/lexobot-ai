import fs from 'fs';
import path from 'path';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 4000;

let tenantMap = {};

const tenantMapPath = path.resolve('./tenants.json');

async function loadTenantMapAsync() {
    try {
        const data = await fs.promises.readFile(tenantMapPath, 'utf-8');
        tenantMap = JSON.parse(data);
    } catch (err) {
        console.error('❌ Failed to reload tenants.json:', err);
    }
}

loadTenantMapAsync();

fs.watchFile(tenantMapPath, { interval: 1000 }, () => {
    loadTenantMapAsync();
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/api', (req, res, next) => {
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid X-Tenant-ID header' });
    }

    const target = tenantMap[tenantId];

    if (!target) {
        return res.status(400).json({ error: `Unknown tenant_id: ${tenantId}` });
    }

    return createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`Tenant Gateway listening on port ${PORT}`);
});
