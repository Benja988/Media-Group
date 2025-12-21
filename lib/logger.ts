import { User } from "./models";

type LogLevel = "info" | "warn" | "error";

function log(level: LogLevel, message: string, meta?: unknown) {
    const payload = {
        level,
        message,
        timeStamp: new Date().toISOString(),
        ...(meta ? { meta } : {}),
    };

    console[level === "error" ? "error" : "log"](JSON.stringify(payload));
}

export const logger = {
    info: (msg: string, meta?: unknown) => log("info", msg, meta),
    warn: (msg: string, meta?: unknown) => log("warn", msg, meta),
    error: (msg: string, meta?: unknown) => log("error", msg, meta),
}


/* example:
logger.info("User logged in", { userId: User._id });
logger.error("Login failed", { email }); */