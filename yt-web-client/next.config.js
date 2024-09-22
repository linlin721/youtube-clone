// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig


// next.config.js
module.exports = {
    webpack: (config, { isServer }) => {
      config.module.rules.push({
        test: /\.js$/,
        include: /node_modules\/undici/, // Include the undici package
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              // Add Babel plugin to support private class fields
              '@babel/plugin-proposal-private-methods',
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      });
      
      return config;
    },
  };
  