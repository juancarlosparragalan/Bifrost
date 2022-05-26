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

const {
    config
} = require('../config/config'), service = config.serviceName;

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
                logger.error(message,[{msgId:process.env.MSGID}])
                console.error(message)
            } else {
                logger.info(message,[{msgId:process.env.MSGID}])
                console.log(message)
            }
        } else {
            if (typeof result == 'object') {
                if (level == 'error') {
                    logger.error(message,[{msgId:process.env.MSGID}]);
                    logger.error(result,[{msgId:process.env.MSGID}]);
                    console.error(message);
                    console.error(result);
                } else {
                    logger.info(message,[{msgId:process.env.MSGID}]);
                    logger.info(result,[{msgId:process.env.MSGID}]);
                    console.log(message);
                    console.log(result);
                }
            } else {
                if (level == 'error') {
                    logger.error(message + ' - ' + result,[{msgId:process.env.MSGID}]);
                    console.error(message + ' - ' + result);
                } else {
                    logger.info(message + ' - ' + result,[{msgId:process.env.MSGID}]);
                    console.log(message + ' - ' + result);
                }
            }
        }
    }
}