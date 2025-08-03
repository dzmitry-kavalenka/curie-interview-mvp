import chalk from "chalk";

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Current log level (can be set via environment variable)
const currentLogLevel = process.env.LOG_LEVEL
  ? (parseInt(process.env.LOG_LEVEL) as LogLevel)
  : LogLevel.INFO;

class Logger {
  private formatMessage(
    level: string,
    message: string,
    data?: unknown
  ): string {
    const timestamp = new Date().toISOString();
    const formattedMessage = `${chalk.gray(timestamp)} ${level} ${message}`;

    if (data) {
      return `${formattedMessage}\n${chalk.gray(
        JSON.stringify(data, null, 2)
      )}`;
    }

    return formattedMessage;
  }

  debug(message: string, data?: unknown): void {
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.log(this.formatMessage(chalk.blue("DEBUG"), message, data));
    }
  }

  info(message: string, data?: unknown): void {
    if (currentLogLevel <= LogLevel.INFO) {
      console.log(this.formatMessage(chalk.green("INFO"), message, data));
    }
  }

  warn(message: string, data?: unknown): void {
    if (currentLogLevel <= LogLevel.WARN) {
      console.log(this.formatMessage(chalk.yellow("WARN"), message, data));
    }
  }

  error(message: string, error?: unknown): void {
    if (currentLogLevel <= LogLevel.ERROR) {
      const errorMessage = error instanceof Error ? error.message : error;
      console.error(
        this.formatMessage(chalk.red("ERROR"), message, errorMessage)
      );

      if (error instanceof Error && error.stack) {
        console.error(chalk.gray(error.stack));
      }
    }
  }

  // Specialized loggers for different contexts
  upload(message: string, data?: unknown): void {
    console.log(this.formatMessage(chalk.cyan("UPLOAD"), message, data));
  }

  summary(message: string, data?: unknown): void {
    console.log(this.formatMessage(chalk.magenta("SUMMARY"), message, data));
  }

  database(message: string, data?: unknown): void {
    console.log(this.formatMessage(chalk.blue("DATABASE"), message, data));
  }

  ai(message: string, data?: unknown): void {
    console.log(this.formatMessage(chalk.green("AI"), message, data));
  }

  file(message: string, data?: unknown): void {
    console.log(this.formatMessage(chalk.yellow("FILE"), message, data));
  }
}

export const logger = new Logger();
