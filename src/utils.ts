import { Tool } from '@modelcontextprotocol/sdk/types';
import { Static, TObject, TSchema } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const validateToolArgsParameters = <T extends TSchema>(
  tool: Tool,
  data: unknown
) => {
  const schema = tool.inputSchema;

  if (!schema) {
    throw new Error(`Tool ${tool.name} does not have an inputSchema defined`);
  }

  const validateConfig = TypeCompiler.Compile(schema as TObject);

  if (!validateConfig.Check(data)) {
    const errors = [...validateConfig.Errors(data)];
    throw new Error(`Config validation failed: ${JSON.stringify(errors)}`);
  }

  return data as Static<T>;
};
