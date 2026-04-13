/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "pbs.twimg.com",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5000",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
            },
            {
                protocol: "https",
                hostname: "localhost",
            },
        ],
        formats: ["image/webp", "image/avif"],
    },
};

export default nextConfig;