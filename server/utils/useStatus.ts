import { H3Event, StatusCode } from "h3";

export const set2xStatus = (
  event: H3Event,
  statusCode: StatusCode,
  message?: string
): void => {
  let statusCodeMessage: string = "";
  switch (statusCode) {
    case 200:
      statusCodeMessage = "OK";
      break;
    case 201:
      statusCodeMessage = "Created";
      break;
    case 202:
      statusCodeMessage = "Accepted";
      break;
    case 203:
      statusCodeMessage = "Non-Authoritative Information";
      break;
    case 204:
      statusCodeMessage = "No Content";
      break;
    case 205:
      statusCodeMessage = "Reset Content";
      break;
    case 206:
      statusCodeMessage = "Partial Content";
      break;
    case 207:
      statusCodeMessage = "Multi-Status";
      break;
    case 208:
      statusCodeMessage = "Already Reported";
      break;
    case 226:
      statusCodeMessage = "IM Used";
      break;
    default:
      statusCodeMessage = "OK";
      break;
  }
  event.node.res.statusCode = statusCode;
  event.node.res.statusMessage = `${statusCodeMessage} ${message}`;
};
