function isProd() {
    return process.env.ENV == null || process.env.ENV === 'production';
}

module.exports = {
    isProd: isProd,
    logger: {
        name: 'maya',
        stream: process.stdout,
        level: isProd() ? 'info' : 'debug'
    },
    db: {
        url: 'mongodb://127.0.0.1:27017/maya'
    }
};
