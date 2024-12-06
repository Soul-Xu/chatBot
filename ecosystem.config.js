module.exports = {
  apps: [{
    name: 'chatbot',
    script: 'node',
    args: 'node_modules/next/dist/bin/next start',
    cwd: '/app/chatbot-web',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/app/logs/err.log',
    out_file: '/app/logs/out.log',
    log_file: '/app/logs/combined.log',
    pid_file: '/app/logs/pid.log',
    log_type: 'json',
    merge_logs: true
  }]
};