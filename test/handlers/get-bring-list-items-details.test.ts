import tap from 'tap';
import { bringMock, resetBringMock } from '../mocks/bringClientMock';
import { handleGetBringListItemsDetails } from '../../src/handlers';
import {
  mockListsResponse,
  mockItemsDetailsResponse,
} from '../mocks/bringResponseMock';

tap.test('handleGetBringListItemsDetails', async (t) => {
  const validListId = 'list-1';
  const invalidListId = 'non-existent-list';

  t.beforeEach(() => {
    resetBringMock();
  });

  t.test(
    'should return item details when list exists and has items',
    async (t) => {
      bringMock.getLists.resolves(mockListsResponse);
      bringMock.getItemsDetails.resolves(mockItemsDetailsResponse);

      const response = await handleGetBringListItemsDetails(bringMock, {
        listId: validListId,
      });

      t.match(response, {
        content: [
          {
            type: 'text',
            text: `Detailed items in list 'Groceries':\n- Item ID: apple, Assigned To: user-123, Section: produce\n- Item ID: milk, Assigned To: none, Section: refrigerated`,
          },
        ],
      });
      t.equal(bringMock.getLists.callCount, 1);
      t.equal(bringMock.getItemsDetails.callCount, 1);
      t.same(bringMock.getItemsDetails.firstCall.args, [validListId]);
    }
  );

  t.test(
    'should return empty message when list exists but has no items',
    async (t) => {
      bringMock.getLists.resolves(mockListsResponse);
      bringMock.getItemsDetails.resolves([]);

      const response = await handleGetBringListItemsDetails(bringMock, {
        listId: validListId,
      });

      t.match(response, {
        content: [
          {
            type: 'text',
            text: `No item details found in list 'Groceries'.`,
          },
        ],
      });
      t.equal(bringMock.getLists.callCount, 1);
      t.equal(bringMock.getItemsDetails.callCount, 1);
    }
  );

  t.test('should return error when list not found', async (t) => {
    bringMock.getLists.resolves(mockListsResponse);

    const response = await handleGetBringListItemsDetails(bringMock, {
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
    t.equal(bringMock.getItemsDetails.callCount, 0);
  });

  t.test('should handle error when getting lists', async (t) => {
    const errorMessage = 'Failed to get lists';
    bringMock.getLists.rejects(new Error(errorMessage));

    const response = await handleGetBringListItemsDetails(bringMock, {
      listId: validListId,
    });

    t.match(response, {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
    });
  });

  t.test('should handle error when getting item details', async (t) => {
    const errorMessage = 'Failed to get item details';
    bringMock.getLists.resolves(mockListsResponse);
    bringMock.getItemsDetails.rejects(new Error(errorMessage));

    const response = await handleGetBringListItemsDetails(bringMock, {
      listId: validListId,
    });

    t.match(response, {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
    });
  });
});
