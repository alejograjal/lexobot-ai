/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://187.33.158.74:8000/api/:path*',
            },
        ];
    },
}

module.exports = nextConfig
