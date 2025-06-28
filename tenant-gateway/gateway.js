import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

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

app.get('/tenants', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== ADMIN_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(200).json(tenantMap);
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

     try {
        new URL(target);
    } catch {
        return res.status(400).json({ error: `Invalid target URL for tenant_id: ${tenantId}` });
    }

    return createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        proxyTimeout: 10000,
        onError(err, req, res) {
            console.error('❌ Proxy error:', err.message);
            res.status(502).json({ error: 'Bad Gateway. Target server unreachable.' });
        },
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`Tenant Gateway listening on port ${PORT}`);
});
