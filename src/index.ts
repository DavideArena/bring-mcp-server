import { config } from './config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import {
  addRecipeItemsToBringListTool,
  getBringListItemsTool,
  getBringListsTool,
  removeItemOrAllFromBringListTool,
  getBringListItemsDetailsTool,
  getAllUsersFromBringListTool,
  tools,
} from './tool';
import {
  handleAddRecipeItemsToBringList,
  handleGetAllUsersFromBringList,
  handleGetBringListItems,
  handleGetBringListItemsDetails,
  handleGetBringLists,
  handleRemoveItemOrAllFromBringList,
  handleUnknownTool,
} from './handlers';
import { Bring } from './bring';

const server = new McpServer(
  {
    name: 'bring-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

const bringClient = new Bring({
  mail: config.BRING_EMAIL,
  password: config.BRING_PASSWORD,
  apiKey: config.BRING_API_KEY,
});

server.server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.schema,
    })),
  };
});

server.server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case addRecipeItemsToBringListTool.name:
        return await handleAddRecipeItemsToBringList(
          bringClient,
          request.params.parameters
        );

      case getBringListItemsTool.name:
        return await handleGetBringListItems(
          bringClient,
          request.params.parameters
        );

      case getBringListsTool.name:
        return await handleGetBringLists(bringClient);

      case removeItemOrAllFromBringListTool.name:
        return await handleRemoveItemOrAllFromBringList(
          bringClient,
          request.params.parameters
        );

      case getBringListItemsDetailsTool.name:
        return await handleGetBringListItemsDetails(
          bringClient,
          request.params.parameters
        );

      case getAllUsersFromBringListTool.name:
        return await handleGetAllUsersFromBringList(
          bringClient,
          request.params.parameters
        );

      default:
        return handleUnknownTool(request.params.name);
    }
  } catch (err) {
    console.error(err);

    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred';
    return {
      error: {
        type: 'server_error',
        message: errorMessage,
      },
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Bring MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Error running Bring MCP Server', error);
  process.exit(1);
});
