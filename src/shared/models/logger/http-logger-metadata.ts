import { Response } from 'express';
import IExtendedRequest from '../extensions/request.extension';

export interface IHTTPLogMetaData {
  req: IExtendedRequest;
  res: Response;
  responseBody: any;
  requestDuration?: string;
}
