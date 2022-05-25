const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    combine,
    timestamp,
    ms,
    prettyPrint
} = format;
const service = 'ZAFIRO-CONNECTOR';

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(), ms(),
        prettyPrint()),
    defaultMeta: {
        service: service
    },
    transports: [
        new transports.File({
            filename: __dirname + 'logs/' + 'error.log',
            level: 'error'
        }),
        new transports.File({
            filename: __dirname + 'logs/' + 'info.log',
            level: 'info'
        })
    ],
});
module.exports = {
    async loggerFunction(message, result = null, level = 'info') {
        if (!result) {
            if (level == 'error') {
                logger.error(message)
                console.error(message)
            } else {
                logger.info(message)
                console.log(message)
            }
        } else {
            if (typeof result == 'object') {
                if (level == 'error') {
                    logger.error(message);
                    logger.error(result);
                    console.error(message);
                    console.error(result);
                } else {
                    logger.info(message);
                    logger.info(result);
                    console.log(message);
                    console.log(result);
                }
            } else {
                if (level == 'error') {
                    logger.error(message + ' - ' + result);
                    console.error(message + ' - ' + result);
                } else {
                    logger.info(message + ' - ' + result)
                    //logger.info(message,[result]);
                    console.log(message + ' - ' + result);
                }
            }
        }
    }
}