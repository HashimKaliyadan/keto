import type { NextConfig } from 'next';
const config: NextConfig = { experimental: { workerThreads: true, cpus: 2 }, compiler: { removeConsole: { exclude: ['error', 'warn'] } } };
export default config;
