// PM2 process manager config — run with: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'lsm3-backend',
      script: 'src/index.js',
      instances: 'max',        // use all CPU cores
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
