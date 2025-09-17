import { createError } from "h3";
import type { H3Error, H3Event, StatusCode } from "h3";
import { useLogger } from "./logger";

// --- 4xx errors ---
export const use4xError = (
  event: H3Event,
  statusCode: StatusCode,
  message: string
): H3Error => {
  let statusCodeMessage = "";

  switch (statusCode) {
    case 400:
      statusCodeMessage = "Bad Request";
      break;
    case 401:
      statusCodeMessage = "Unauthorized";
      break;
    case 402:
      statusCodeMessage = "Payment Required";
      break;
    case 403:
      statusCodeMessage = "Forbidden";
      break;
    case 404:
      statusCodeMessage = "Not Found";
      break;
    case 405:
      statusCodeMessage = "Method Not Allowed";
      break;
    case 406:
      statusCodeMessage = "Not Acceptable";
      break;
    case 407:
      statusCodeMessage = "Proxy Authentication Required";
      break;
    case 408:
      statusCodeMessage = "Request Timeout";
      break;
    case 409:
      statusCodeMessage = "Conflict";
      break;
    case 410:
      statusCodeMessage = "Gone";
      break;
    case 411:
      statusCodeMessage = "Length Required";
      break;
    case 412:
      statusCodeMessage = "Precondition Failed";
      break;
    case 413:
      statusCodeMessage = "Payload Too Large";
      break;
    case 414:
      statusCodeMessage = "URI Too Long";
      break;
    case 415:
      statusCodeMessage = "Unsupported Media Type";
      break;
    case 416:
      statusCodeMessage = "Range Not Satisfiable";
      break;
    case 417:
      statusCodeMessage = "Expectation Failed";
      break;
    case 418:
      statusCodeMessage = "I'm a teapot";
      break;
    case 421:
      statusCodeMessage = "Misdirected Request";
      break;
    case 422:
      statusCodeMessage = "Unprocessable Entity";
      break;
    case 423:
      statusCodeMessage = "Locked";
      break;
    case 424:
      statusCodeMessage = "Failed Dependency";
      break;
    case 425:
      statusCodeMessage = "Too Early";
      break;
    case 426:
      statusCodeMessage = "Upgrade Required";
      break;
    case 428:
      statusCodeMessage = "Precondition Required";
      break;
    case 429:
      statusCodeMessage = "Too Many Requests";
      break;
    case 431:
      statusCodeMessage = "Request Header Fields Too Large";
      break;
    case 451:
      statusCodeMessage = "Unavailable For Legal Reasons";
      break;
    default:
      statusCodeMessage = "Client Error";
      break;
  }
  event.node.res.statusCode = statusCode;
  event.node.res.statusMessage = statusCodeMessage;
  useLogger(event, "error", `${statusCodeMessage} - ${message}`);
  return createError({ statusCode, message, statusMessage: statusCodeMessage });
};

// --- 5xx errors ---
export const use5xError = (
  event: H3Event,
  statusCode: StatusCode,
  message: string
): H3Error => {
  let statusCodeMessage = "";

  switch (statusCode) {
    case 500:
      statusCodeMessage = "Internal Server Error";
      break;
    case 501:
      statusCodeMessage = "Not Implemented";
      break;
    case 502:
      statusCodeMessage = "Bad Gateway";
      break;
    case 503:
      statusCodeMessage = "Service Unavailable";
      break;
    case 504:
      statusCodeMessage = "Gateway Timeout";
      break;
    case 505:
      statusCodeMessage = "HTTP Version Not Supported";
      break;
    case 506:
      statusCodeMessage = "Variant Also Negotiates";
      break;
    case 507:
      statusCodeMessage = "Insufficient Storage";
      break;
    case 508:
      statusCodeMessage = "Loop Detected";
      break;
    case 510:
      statusCodeMessage = "Not Extended";
      break;
    case 511:
      statusCodeMessage = "Network Authentication Required";
      break;
    default:
      statusCodeMessage = "Server Error";
      break;
  }
  event.node.res.statusCode = statusCode;
  event.node.res.statusMessage = statusCodeMessage;
  useLogger(event, "error", `${statusCodeMessage} - ${message}`);
  return createError({ statusCode, message, statusMessage: statusCodeMessage });
};
