import morgan, { StreamOptions } from 'morgan';
import { NODE_ENV } from '../consts';

import Logger from '../logger/logger';

const stream: StreamOptions = {
  // Use the http severity
  write: message => Logger.http(message)
};

const skip = () => {
  return NODE_ENV !== 'development';
};

// Build the morgan middleware
const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream,
  skip
});

export default morganMiddleware;
