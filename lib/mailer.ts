import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
import { logger } from "./logger";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 0);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!user || !pass) {
  logger.warn("SMTP credentials missing; outgoing emails may fail", {
    SMTP_HOST: host,
    SMTP_PORT: port,
    hasUser: !!user,
    hasPass: !!pass,
  });
}

export const mailer = nodemailer.createTransport({
  host,
  port,
  secure: false,
  auth: user || pass ? { user, pass } : undefined,
});

/* 
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
*/