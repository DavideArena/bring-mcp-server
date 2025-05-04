import { config } from './config';
import {
  addRecipeItemsToBringListTool,
  AddRecipeItemsParamsSchema,
  getAllUsersFromBringListTool,
  GetAllUsersFromBringListParamsSchema,
  getBringListItemsDetailsTool,
  GetBringListItemsDetailsParamsSchema,
  getBringListItemsTool,
  GetBringListItemsParamsSchema,
  removeItemOrAllFromBringListTool,
  RemoveItemOrAllFromBringListParamsSchema,
} from './tool';
import { validateToolArgsParameters } from './utils';
import { Bring } from './bring';

const parseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
};

export const handleAddRecipeItemsToBringList = async (
  bringClient: Bring,
  parameters: unknown
) => {
  const { listId, items, confirm } = validateToolArgsParameters<
    typeof AddRecipeItemsParamsSchema
  >(addRecipeItemsToBringListTool, parameters);

  if (!confirm) {
    return {
      content: [
        {
          type: 'text',
          text: 'User did not confirm. No items were added to the Bring list.',
        },
      ],
    };
  }

  try {
    const listsResult = await bringClient.getLists();

    for (const list of listsResult.lists) {
      if (list.listUuid === listId) {
        for (const item of items) {
          await bringClient.addItemToList(listId, item, '');
        }
        return {
          content: [
            {
              type: 'text',
              text: `Added items to list '${list.name}':\n- ${items.join(
                '\n- '
              )}`,
            },
          ],
        };
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `List '${listId}' not found for user.`,
        },
      ],
    };
  } catch (e) {
    return {
      content: [{ type: 'text', text: `Error: ${parseErrorMessage(e)}` }],
    };
  }
};

export const handleGetBringListItems = async (
  bringClient: Bring,
  parameters: unknown
) => {
  const { listId } = validateToolArgsParameters<
    typeof GetBringListItemsParamsSchema
  >(getBringListItemsTool, parameters);

  try {
    const items = await bringClient.getItems(listId);
    const purchaseItems = items.purchase.map((i) => i.name);
    return {
      content: [
        {
          type: 'text',
          text: `Items in list:\n- ${purchaseItems.join('\n- ') || '(empty)'}`,
        },
      ],
    };
  } catch (e) {
    return {
      content: [{ type: 'text', text: `Error: ${parseErrorMessage(e)}` }],
    };
  }
};

export const handleGetBringLists = async (bringClient: Bring) => {
  try {
    const lists = await bringClient.getLists();
    return {
      content: [
        {
          type: 'text',
          text:
            `Lists for user '${config.BRING_EMAIL}':\n` +
            lists.lists
              .map((l) => `- ${l.name} (ID: ${l.listUuid})`)
              .join('\n'),
        },
      ],
    };
  } catch (err) {
    console.log;
    return {
      content: [{ type: 'text', text: `Error: ${parseErrorMessage(err)}` }],
    };
  }
};

export const handleRemoveItemOrAllFromBringList = async (
  bringClient: Bring,
  parameters: unknown
) => {
  const { listId, item, confirm } = validateToolArgsParameters<
    typeof RemoveItemOrAllFromBringListParamsSchema
  >(removeItemOrAllFromBringListTool, parameters);

  if (!confirm) {
    return {
      content: [
        {
          type: 'text',
          text: 'User did not confirm. No items were removed from the Bring list.',
        },
      ],
    };
  }

  try {
    const lists = await bringClient.getLists();
    const list = lists.lists.find((l) => l.listUuid === listId);

    if (!list) {
      return {
        content: [
          {
            type: 'text',
            text: `List '${listId}' not found for user.`,
          },
        ],
      };
    }

    if (item) {
      await bringClient.removeItemFromList(listId, item);
      return {
        content: [
          {
            type: 'text',
            text: `Removed item '${item}' from list '${list.name}'.`,
          },
        ],
      };
    }

    const items = await bringClient.getItems(listId);

    for (const entry of items.purchase) {
      await bringClient.removeItemFromList(listId, entry.name);
    }

    return {
      content: [
        {
          type: 'text',
          text: `All items removed from list '${list.name}'.`,
        },
      ],
    };
  } catch (e) {
    return {
      content: [{ type: 'text', text: `Error: ${parseErrorMessage(e)}` }],
    };
  }
};

export const handleGetBringListItemsDetails = async (
  bringClient: Bring,
  parameters: unknown
) => {
  const { listId } = validateToolArgsParameters<
    typeof GetBringListItemsDetailsParamsSchema
  >(getBringListItemsDetailsTool, parameters);

  try {
    const lists = await bringClient.getLists();
    const list = lists.lists.find((l) => l.listUuid === listId);

    if (!list) {
      return {
        content: [
          {
            type: 'text',
            text: `List '${listId}' not found for user.`,
          },
        ],
      };
    }
    const details = await bringClient.getItemsDetails(listId);
    if (!details.length) {
      return {
        content: [
          {
            type: 'text',
            text: `No item details found in list '${list.name}'.`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: 'text',
          text:
            `Detailed items in list '${list.name}':\n` +
            details
              .map(
                (d) =>
                  `- Item ID: ${d.itemId}, Assigned To: ${
                    d.assignedTo || 'none'
                  }, Section: ${d.userSectionId || 'none'}`
              )
              .join('\n'),
        },
      ],
    };
  } catch (e) {
    return {
      content: [{ type: 'text', text: `Error: ${parseErrorMessage(e)}` }],
    };
  }
};

export const handleGetAllUsersFromBringList = async (
  bringClient: Bring,
  parameters: unknown
) => {
  const { listId } = validateToolArgsParameters<
    typeof GetAllUsersFromBringListParamsSchema
  >(getAllUsersFromBringListTool, parameters);

  try {
    const lists = await bringClient.getLists();
    const list = lists.lists.find((l) => l.listUuid === listId);
    if (!list) {
      return {
        content: [
          {
            type: 'text',
            text: `List '${listId}' not found for user.`,
          },
        ],
      };
    }
    const usersResponse = await bringClient.getAllUsersFromList(listId);
    if (!usersResponse.users.length) {
      return {
        content: [
          {
            type: 'text',
            text: `No users found for list '${list.name}'.`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: 'text',
          text:
            `Users for list '${list.name}':\n` +
            usersResponse.users
              .map((u) => `- ${u.name} (${u.email})`)
              .join('\n'),
        },
      ],
    };
  } catch (e) {
    return {
      content: [{ type: 'text', text: `Error: ${parseErrorMessage(e)}` }],
    };
  }
};

export const handleUnknownTool = (toolName: string) => {
  return {
    error: {
      type: 'not_found',
      message: `Unknown tool: ${toolName}`,
    },
  };
};
