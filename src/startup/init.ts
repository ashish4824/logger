import { Express } from 'express';
import mongooseConnect from '../databases/mongodb/mongodb';
import { cliLoggerService } from '../services/logger/cli-logger.service';
import { ErrorMessages } from '../shared/enums/messages/error-messages.enum';
import { InfoMessages } from '../shared/enums/messages/info-messages.enum';
import { SpecialMessages } from '../shared/enums/messages/special-messages.enum';
import { exceptionLogWrapper } from '../shared/helpers/exception-log-wrapper.helper';

const appSetup = async (app: Express) => {
  try {
    // Try to connect to MongoDB
    try {
      await mongooseConnect();
      cliLoggerService.info(InfoMessages.DatabasesConnected);
    } catch (dbError) {
      cliLoggerService.error('Failed to connect to MongoDB. Please ensure MongoDB is running.');
      process.exit(1);
    }

    cliLoggerService.info(SpecialMessages.DottedLine);
    const PORT = Number(process.env.PORT) || 3000;

    app.listen(PORT, () => {
      cliLoggerService.info(`Server started on port ${PORT} 🚀🚀🚀`);
    });
  } catch (error: unknown) {
    exceptionLogWrapper(error, ErrorMessages.AppStartupFail);
  }
};

export default appSetup;
