module.exports = {
  apps: [{
    name: 'wealth-server',
    script: 'server.js',
    watch: true,
    env_file: '.env',
    env: {
      NODE_ENV: 'development'
    }
  }]
} 