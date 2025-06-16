/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    env: {
        NEXT_PUBLIC_API_LEXOBOT_URL: process.env.NEXT_PUBLIC_API_LEXOBOT_URL,
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_LEXOBOT_URL}/api/:path*`,
            },
        ];
    },
}

module.exports = nextConfig
