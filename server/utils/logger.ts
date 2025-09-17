import { createLogger, LogLevelName } from "bs-logger";
import { H3Event } from "h3";

const logger = createLogger({
  context: { hostname: "http://localhost:3000" },
  targets: process.env.LOG_FILE,
  translate: (m) => {
    console.log(m.message);
    return m;
  },
});

export const useLogger = (
  event: H3Event,
  level: LogLevelName,
  message?: string
): void => {
  logger[level](
    `${event.node.req.url}:${event.node.req.method?.toUpperCase()} (${
      event.node.res.statusCode
    }) ${message}`
  );
};
