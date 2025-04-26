import tap from 'tap';
import { bringMock, resetBringMock } from '../mocks/bringClientMock';
import { handleGetAllUsersFromBringList } from '../../src/handlers';
import {
  mockListsResponse,
  mockUsersResponse,
} from '../mocks/bringResponseMock';

tap.test('handleGetAllUsersFromBringList', async (t) => {
  const validListId = 'list-1';
  const invalidListId = 'non-existent-list';

  t.beforeEach(() => {
    resetBringMock();
  });

  t.test('should return users when list exists and has users', async (t) => {
    bringMock.getLists.resolves(mockListsResponse);
    bringMock.getAllUsersFromList.resolves(mockUsersResponse);

    const response = await handleGetAllUsersFromBringList(bringMock, {
      listId: validListId,
    });

    t.match(response, {
      content: [
        {
          type: 'text',
          text: `Users for list 'Groceries':\n- Test User (test@example.com)\n- Another User (another@example.com)`,
        },
      ],
    });
    t.equal(bringMock.getLists.callCount, 1);
    t.equal(bringMock.getAllUsersFromList.callCount, 1);
    t.same(bringMock.getAllUsersFromList.firstCall.args, [validListId]);
  });

  t.test(
    'should return empty message when list exists but has no users',
    async (t) => {
      bringMock.getLists.resolves(mockListsResponse);
      bringMock.getAllUsersFromList.resolves({ users: [] });

      const response = await handleGetAllUsersFromBringList(bringMock, {
        listId: validListId,
      });

      t.match(response, {
        content: [
          {
            type: 'text',
            text: `No users found for list 'Groceries'.`,
          },
        ],
      });
      t.equal(bringMock.getLists.callCount, 1);
      t.equal(bringMock.getAllUsersFromList.callCount, 1);
    }
  );

  t.test('should return error when list not found', async (t) => {
    bringMock.getLists.resolves(mockListsResponse);

    const response = await handleGetAllUsersFromBringList(bringMock, {
      listId: invalidListId,
    });

    t.match(response, {
      content: [
        {
          type: 'text',
          text: `List '${invalidListId}' not found for user.`,
        },
      ],
    });
    t.equal(bringMock.getAllUsersFromList.callCount, 0);
  });

  t.test('should handle error when getting lists', async (t) => {
    const errorMessage = 'Failed to get lists';
    bringMock.getLists.rejects(new Error(errorMessage));

    const response = await handleGetAllUsersFromBringList(bringMock, {
      listId: validListId,
    });

    t.match(response, {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
    });
  });

  t.test('should handle error when getting users', async (t) => {
    const errorMessage = 'Failed to get users';
    bringMock.getLists.resolves(mockListsResponse);
    bringMock.getAllUsersFromList.rejects(new Error(errorMessage));

    const response = await handleGetAllUsersFromBringList(bringMock, {
      listId: validListId,
    });

    t.match(response, {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
    });
  });
});
