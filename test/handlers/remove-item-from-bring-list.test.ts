import { bringMock, resetBringMock } from '../mocks/bringClientMock';
import { handleRemoveItemOrAllFromBringList } from '../../src/handlers';
import {
  mockListsResponse,
  mockItemsResponse,
} from '../mocks/bringResponseMock';
import tap from 'tap';

tap.test('handleRemoveItemOrAllFromBringList', async (t) => {
  const validListId = 'list-1';
  const invalidListId = 'non-existent-list';
  const itemToRemove = 'Apples';

  t.beforeEach(() => {
    resetBringMock();
  });

  t.test('should not remove items when not confirmed', async (t) => {
    const parameters = {
      listId: validListId,
      item: itemToRemove,
      confirm: false,
    };

    const response = await handleRemoveItemOrAllFromBringList(
      bringMock,
      parameters
    );

    t.match(response, {
      content: [
        {
          type: 'text',
          text: 'User did not confirm. No items were removed from the Bring list.',
        },
      ],
    });
    t.equal(bringMock.getLists.callCount, 0);
    t.equal(bringMock.removeItemFromList.callCount, 0);
  });

  t.test(
    'should remove specific item when confirmed and list exists',
    async (t) => {
      bringMock.getLists.resolves(mockListsResponse);
      bringMock.removeItemFromList.resolves('');
      const parameters = {
        listId: validListId,
        item: itemToRemove,
        confirm: true,
      };

      const response = await handleRemoveItemOrAllFromBringList(
        bringMock,
        parameters
      );

      t.match(response, {
        content: [
          {
            type: 'text',
            text: `Removed item '${itemToRemove}' from list 'Groceries'.`,
          },
        ],
      });
      t.equal(bringMock.getLists.callCount, 1);
      t.equal(bringMock.removeItemFromList.callCount, 1);
      t.same(bringMock.removeItemFromList.firstCall.args, [
        validListId,
        itemToRemove,
      ]);
    }
  );

  t.test(
    'should remove all items when no specific item provided',
    async (t) => {
      bringMock.getLists.resolves(mockListsResponse);
      bringMock.getItems.resolves(mockItemsResponse);
      bringMock.removeItemFromList.resolves('');
      const parameters = {
        listId: validListId,
        confirm: true,
      };

      const response = await handleRemoveItemOrAllFromBringList(
        bringMock,
        parameters
      );

      t.match(response, {
        content: [
          {
            type: 'text',
            text: `All items removed from list 'Groceries'.`,
          },
        ],
      });
      t.equal(bringMock.getLists.callCount, 1);
      t.equal(bringMock.getItems.callCount, 1);
      t.equal(bringMock.removeItemFromList.callCount, 3);

      mockItemsResponse.purchase.forEach((item, index) => {
        t.same(bringMock.removeItemFromList.getCall(index).args, [
          validListId,
          item.name,
        ]);
      });
    }
  );

  t.test('should return error when list not found', async (t) => {
    bringMock.getLists.resolves(mockListsResponse);
    const parameters = {
      listId: invalidListId,
      item: itemToRemove,
      confirm: true,
    };

    const response = await handleRemoveItemOrAllFromBringList(
      bringMock,
      parameters
    );

    t.match(response, {
      content: [
        {
          type: 'text',
          text: `List '${invalidListId}' not found for user.`,
        },
      ],
    });
    t.equal(bringMock.removeItemFromList.callCount, 0);
  });

  t.test('should handle error when getting lists', async (t) => {
    const errorMessage = 'Failed to get lists';
    bringMock.getLists.rejects(new Error(errorMessage));
    const parameters = {
      listId: validListId,
      item: itemToRemove,
      confirm: true,
    };

    const response = await handleRemoveItemOrAllFromBringList(
      bringMock,
      parameters
    );

    t.match(response, {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
    });
  });

  t.test('should handle error when removing an item', async (t) => {
    const errorMessage = 'Failed to remove item';
    bringMock.getLists.resolves(mockListsResponse);
    bringMock.removeItemFromList.rejects(new Error(errorMessage));
    const parameters = {
      listId: validListId,
      item: itemToRemove,
      confirm: true,
    };

    const response = await handleRemoveItemOrAllFromBringList(
      bringMock,
      parameters
    );

    t.match(response, {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
    });
  });
});
