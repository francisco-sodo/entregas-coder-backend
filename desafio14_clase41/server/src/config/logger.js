import winston, { transports } from 'winston';
import config from "./config.js"



// Custom logger Options
const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        http: 3,
        info: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'magenta',
        http: 'green',
        info: 'blue',
        debug: 'white'
    }
}

winston.addColors(customLevelsOptions.colors)


// logger dev
const devLogger = winston.createLogger({
    // levels
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
    ]
})


// logger prod
const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    // Declaramos transport
    transports: [
        // definimos el transport de consola
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File({ filename: './errors.log', level: "error" })
    ]
})



export const addLogger = (req, res, next) => {
    if (config.environment === 'production') {

        req.logger = prodLogger;
        req.logger.fatal(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.warning(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)

    } else {
        req.logger = devLogger;
        req.logger.fatal(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.warning(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    }

    next()

}



