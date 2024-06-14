/** @type {import('next').NextConfig} */
//import { defineConfig } from 'next';
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.module.rules.push({
          test: /\.csv$/,
          loader: 'csv-loader',
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true
          }
        });
        return config;
      },
      env: {
        //GOOGLE_CLIENT_ID:"895643509716-4vk4lq1smdd2plqtvpan6ldg83e867ti.apps.googleusercontent.com",
        backend: "https://eunoia.inf.pucp.edu.pe"
        //backend:"http://localhost:8080"

    }
};

export default nextConfig;
