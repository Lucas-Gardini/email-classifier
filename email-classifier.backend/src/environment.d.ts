
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string,
      OPENAI_API_KEY: string,
      OPENAI_DEFAULT_MODEL: string,
      MONGO_URI: string,
      REDIS_HOST: string,
      REDIS_PORT: string,
      REDIS_PASSWORD: string
	}
  }
}

