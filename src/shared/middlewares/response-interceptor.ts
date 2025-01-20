import { NextFunction, Response } from 'express';
import { dbLoggerService } from '../../services/logger/db-logger.service';
import { httpLoggerService } from '../../services/logger/http-logger.service';
import { HTTPStatusCode } from '../enums/http/http-status-codes.enum';
import IExtendedRequest from '../models/extensions/request.extension';
import redactLogData from '../helpers/redact-log-data.helper';
import { IHTTPLogMetaData } from '../../services/logger/interface/http-logger-response.interface';
import formatHTTPLoggerResponse from '../../services/logger/utils/format-http-logger-response.utils';

const responseInterceptor = (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const requestStartTime = Date.now();
  req.requestStartTime = requestStartTime;

  const originalSend = res.send;

  let responseSent = false;

  res.send = function (responseBody: any): Response {
    const requestDuration = Date.now() - requestStartTime;
    const durationInSeconds = `${requestDuration / 1000}s`;

    const redactedBody = redactLogData(responseBody);

    if (!responseSent) {
      if (res.statusCode < HTTPStatusCode.BadRequest) {
        const logData: IHTTPLogMetaData = formatHTTPLoggerResponse({
          req,
          res,
          responseBody: redactedBody,
          requestDuration: durationInSeconds
        });

        httpLoggerService.info(logData);
        dbLoggerService.info(logData);
      }
      responseSent = true;
    }

    return originalSend.call(this, responseBody);
  };

  next();
};

export default responseInterceptor;
