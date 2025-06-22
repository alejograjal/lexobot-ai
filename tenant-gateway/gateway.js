import fs from 'fs';
import path from 'path';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 4000;

const tenantMapPath = path.resolve('./tenants.json');

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/api', (req, res, next) => {
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid X-Tenant-ID header' });
    }

    let tenantMap;

    try {
        tenantMap = JSON.parse(fs.readFileSync(tenantMapPath, 'utf-8'));
    } catch (err) {
        console.error('Error loading tenants.json:', err);
        return res.status(500).json({ error: 'Internal tenant mapping error' });
    }

    const target = tenantMap[tenantId];

    console.log(`Request for tenant: ${tenantId}, target: ${target}`);

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
