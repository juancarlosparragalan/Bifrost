const {
    createLogger,
    format

} = require('winston');
var winston = require('winston');
  require('winston-daily-rotate-file');

const {
    combine,
    timestamp,
    ms,
    prettyPrint
} = format;

const {
    config
} = require('../config/config'), service = config.serviceName;

var transportErr = new winston.transports.DailyRotateFile({
        filename: __dirname + 'logs/' + 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        maxSize: '20m',
        level: 'error'
    }),
    transportInfo = new winston.transports.DailyRotateFile({
        filename: __dirname + 'logs/' + 'info-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        maxSize: '20m',
        level: 'info'
    });

transportErr.on('rotate', function (oldFilename, newFilename) {
    // do something fun
});
transportInfo.on('rotate', function (oldFilename, newFilename) {
    // do something fun
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(), ms(),
        prettyPrint()),
    defaultMeta: {
        service: service
    },
    transports: [
        transportErr,
        transportInfo
    ],
});

module.exports = {
    async loggerFunction(message, result = null, level = 'info') {
        if (!result) {
            if (level == 'error') {
                logger.error(message, [{
                    msgId: process.env.MSGID
                }])
                console.error(message)
            } else {
                logger.info(message, [{
                    msgId: process.env.MSGID
                }])
                console.log(message)
            }
        } else {
            if (typeof result == 'object') {
                if (level == 'error') {
                    logger.error(message, [{
                        msgId: process.env.MSGID
                    }]);
                    logger.error(result, [{
                        msgId: process.env.MSGID
                    }]);
                    console.error(message);
                    console.error(result);
                } else {
                    logger.info(message, [{
                        msgId: process.env.MSGID
                    }]);
                    logger.info(result, [{
                        msgId: process.env.MSGID
                    }]);
                    console.log(message);
                    console.log(result);
                }
            } else {
                if (level == 'error') {
                    logger.error(message + ' - ' + result, [{
                        msgId: process.env.MSGID
                    }]);
                    console.error(message + ' - ' + result);
                } else {
                    logger.info(message + ' - ' + result, [{
                        msgId: process.env.MSGID
                    }]);
                    console.log(message + ' - ' + result);
                }
            }
        }
    }
}