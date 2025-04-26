import envSchema from 'env-schema';
import { Type, Static } from '@sinclair/typebox';

const ConfigSchema = Type.Object({
  BRING_EMAIL: Type.String({}),
  BRING_PASSWORD: Type.String({ minLength: 1 }),
  BRING_API_KEY: Type.String({ minLength: 1 }),
});

type ConfigType = Static<typeof ConfigSchema>;

const envPath = process.env.TEST_CI === 'true' ? '/../.env.ci' : '/../.env';
export const config = envSchema<ConfigType>({
  schema: ConfigSchema,
  dotenv: {
    path: __dirname + envPath,
  },
});
