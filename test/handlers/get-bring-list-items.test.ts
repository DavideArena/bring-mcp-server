import tap from 'tap';
import { bringMock, resetBringMock } from '../mocks/bringClientMock';
import { handleGetBringListItems } from '../../src/handlers';
import {
  mockListsResponse,
  mockItemsResponse,
} from '../mocks/bringResponseMock';

tap.test('handleGetBringListItems', async (t) => {
  const validListId = 'list-1';
  const invalidListId = 'non-existent-list';

  t.beforeEach(() => {
    resetBringMock();
  });

  t.test('should return list items when list exists', async (t) => {
    bringMock.getItems.resolves(mockItemsResponse);

    const response = await handleGetBringListItems(bringMock, {
      listId: validListId,
    });

    t.match(response, {
      content: [
        {
          type: 'text',
          text: `Items in list:\n- Apples\n- Milk\n- Bread`,
        },
      ],
    });
    t.equal(bringMock.getItems.callCount, 1);
    t.same(bringMock.getItems.firstCall.args, [validListId]);
  });

  t.test(
    'should return empty list message when list has no items',
    async (t) => {
      bringMock.getLists.resolves(mockListsResponse);
      bringMock.getItems.resolves({
        uuid: 'user-123',
        status: 'ok',
        purchase: [],
        recently: [],
      });

      const response = await handleGetBringListItems(bringMock, {
        listId: validListId,
      });

      t.match(response, {
        content: [
          {
            type: 'text',
            text: `Items in list:\n- (empty)`,
          },
        ],
      });
    }
  );

  t.test('should handle error when getting items', async (t) => {
    const errorMessage = 'Failed to get items';
    bringMock.getLists.resolves(mockListsResponse);
    bringMock.getItems.rejects(new Error(errorMessage));

    const response = await handleGetBringListItems(bringMock, {
      listId: validListId,
    });

    t.match(response, {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
    });
  });
});
