const { Logger } = require("../utils/logger.util");
const { HttpException } = require("@nestjs/common");

function handleLogError(error, logger = new Logger()) {
  switch (true) {
    case error instanceof HttpException: {
      logger
        .setMetadata({ errorType: "HttpException" })
        .error(`message:::${error.message}`);
      break;
    }
    case error instanceof Error: {
      logger
        .setMetadata({ errorType: "Error" })
        .error(`message:::${error.message} - stack:::${error.stack || ""}`);
      break;
    }
    default: {
      logger
        .setMetadata({ errorType: "NotHandledError" })
        .error(`message:::${JSON.stringify(error)}`);
      break;
    }
  }
}

export { handleLogError };
