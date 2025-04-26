import { Tool } from '@modelcontextprotocol/sdk/types';
import { Type } from '@sinclair/typebox';

export const AddRecipeItemsParamsSchema = Type.Object({
  listId: Type.String({
    description: 'The Bring list ID to add items to.',
  }),
  items: Type.Array(Type.String(), {
    minItems: 1,
    description: 'Array of recipe item names to add to the list.',
  }),
  confirm: Type.Boolean({
    description: 'User confirmation to add items. Must be true to proceed.',
  }),
});

export const GetBringListItemsParamsSchema = Type.Object({
  listId: Type.String({
    description: 'The Bring list ID to fetch items from.',
  }),
});

export const GetBringListsParamsSchema = Type.Object({});

export const RemoveItemOrAllFromBringListParamsSchema = Type.Object({
  listId: Type.String({
    description: 'The Bring list ID to remove items from.',
  }),
  item: Type.Optional(
    Type.String({
      description: 'The item to remove. If omitted, all items will be removed.',
    })
  ),
  confirm: Type.Boolean({
    description: 'User confirmation to remove items. Must be true to proceed.',
  }),
});

export const GetBringListItemsDetailsParamsSchema = Type.Object({
  listId: Type.String({
    description: 'The Bring list ID to fetch item details from.',
  }),
});

export const GetAllUsersFromBringListParamsSchema = Type.Object({
  listId: Type.String({
    description: 'The Bring list ID to fetch users from.',
  }),
});

export const addRecipeItemsToBringListTool: Tool = {
  name: 'add-recipe-items-to-bring-list',
  description:
    'Add a list of recipe items to a Bring shopping list. Requires user confirmation before adding.',
  inputSchema: AddRecipeItemsParamsSchema,
};

export const getBringListItemsTool: Tool = {
  name: 'get-bring-list-items',
  description: 'Return all items contained in a Bring shopping list.',
  inputSchema: GetBringListItemsParamsSchema,
};

export const getBringListsTool: Tool = {
  name: 'get-bring-lists',
  description: 'Return all shopping lists for the authenticated Bring user.',
  inputSchema: GetBringListsParamsSchema,
};

export const removeItemOrAllFromBringListTool: Tool = {
  name: 'remove-item-or-all-from-bring-list',
  description:
    'Remove a specific item or all items from a Bring shopping list. Requires user confirmation before removing.',
  inputSchema: RemoveItemOrAllFromBringListParamsSchema,
};

export const getBringListItemsDetailsTool: Tool = {
  name: 'get-bring-list-items-details',
  description:
    'Return detailed information about all items in a Bring shopping list.',
  inputSchema: GetBringListItemsDetailsParamsSchema,
};

export const getAllUsersFromBringListTool: Tool = {
  name: 'get-all-users-from-bring-list',
  description:
    'Return all users associated with a specific Bring shopping list.',
  inputSchema: GetAllUsersFromBringListParamsSchema,
};

export const tools = [
  addRecipeItemsToBringListTool,
  getBringListItemsTool,
  getBringListsTool,
  removeItemOrAllFromBringListTool,
  getBringListItemsDetailsTool,
  getAllUsersFromBringListTool,
];
