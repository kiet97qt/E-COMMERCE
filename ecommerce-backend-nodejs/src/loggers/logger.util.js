const winston = require("winston");
const { winstonOptions } = require("../configs/logger.config");

class Logger {
  static _logger;

  metadata = {};

  getMetadata() {
    return this.metadata;
  }

  static getLogger() {
    if (!Logger._logger) {
      Logger._logger = winston.createLogger(winstonOptions);
    }
    return Logger._logger;
  }

  _childLogger;

  constructor(
    metadata = {
      context: null,
      functionName: null,
      requestId: null,
      metadata: {},
    }
  ) {
    this._childLogger = Logger.getLogger().child(metadata);
    this.metadata = metadata;
  }

  static crit(message) {
    Logger.getLogger().crit(message);
  }

  static error(message) {
    Logger.getLogger().error(message);
  }

  static warn(message) {
    Logger.getLogger().warn(message);
  }

  static info(message) {
    Logger.getLogger().info(message);
  }

  static http(message) {
    Logger.getLogger().http(message);
  }

  static verbose(message) {
    Logger.getLogger().verbose(message);
  }

  static debug(message) {
    Logger.getLogger().debug(message);
  }

  static silly(message) {
    Logger.getLogger().silly(message);
  }

  crit(message) {
    this._childLogger.crit(message);
  }

  error(message) {
    this._childLogger.error(message);
  }

  warn(message) {
    this._childLogger.warn(message);
  }

  info(message) {
    this._childLogger.info(message);
  }

  http(message) {
    this._childLogger.http(message);
  }

  verbose(message) {
    this._childLogger.verbose(message);
  }

  debug(message) {
    this._childLogger.debug(message);
  }

  silly(message) {
    this._childLogger.silly(message);
  }

  setMetadata(metadata = {}) {
    const newLogger = new Logger({ ...this.metadata, metadata });
    return newLogger;
  }

  addFunctionName(name) {
    const newLogger = new Logger({ ...this.metadata, functionName: name });
    return newLogger;
  }
}

module.exports = { Logger };
