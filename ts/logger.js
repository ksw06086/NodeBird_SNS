const { createLogger, format, transports } = require('winston');

// console Level
// console.log > console.info > console.warn > console.error
const logger = createLogger({
    level: 'info', // info, warn, error 기록
    format: format.json(),
    transports: [
        new transports.File({ filename: 'combined.log' }),
        new transports.File({ filename: 'error.log', level: 'error' }),
    ],
})

if(process.env.NODE_ENV !== 'production'){
    logger.add(new transports.Console({ format: format.simple() }));
}

module.exports = logger;