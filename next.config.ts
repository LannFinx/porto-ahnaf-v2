import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Terapkan ke semua rute
        source: '/(.*)',
        headers: [
          {
            // Mencegah web Anda dimasukkan ke dalam iframe web lain (Clickjacking)
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Memaksa browser menghargai MIME type (Mencegah MIME Sniffing)
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Filter XSS bawaan browser
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            // Mencegah browser mengirimkan informasi asal (referrer) ketika navigasi ke web HTTP yang tidak aman
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          }
        ],
      },
    ];
  },
};

export default nextConfig;
