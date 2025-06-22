import express from 'express';
import fs from 'fs';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 4000;

const tenantMapPath = path.resolve('./tenants.json');
const tenantMap = JSON.parse(fs.readFileSync(tenantMapPath, 'utf-8'));

app.use('/api', (req, res, next) => {
    const tenantId = req.query.tenant_id;
    const target = tenantMap[tenantId];

    if (!target) {
        return res.status(400).json({ error: 'Invalid or missing tenant_id' });
    }

    return createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            '^/api': '',
        }
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`Tenant Gateway listening on port ${PORT}`);
});
