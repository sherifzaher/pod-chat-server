interface Env {
  PORT: number;
  MYSQL_DB_HOST: string;
  MYSQL_DB_USERNAME: string;
  MYSQL_DB_PASSWORD: string;
  MYSQL_DB_PORT: number;
  MYSQL_DB_DATABASE: string;
  COOKIE_SECRET: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export {};
