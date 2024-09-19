import * as Joi from 'joi';

export const appConfig = {
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.number().required(),
    APP_ENV: Joi.string().required(),
  }),
};

export enum ConfigKey {
  PORT = 'PORT',
  APP_ENV = 'APP_ENV',
}

export enum AppEnvironment {
  LOCAL = 'LOCAL',
  STAGE = 'DEV',
  TESTING = 'TESTING',
  PROD = 'PRODUCTION',
}

export enum CronJobs {}
