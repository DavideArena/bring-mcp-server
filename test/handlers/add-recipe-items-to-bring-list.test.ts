import tap from 'tap';
import { bringMock, resetBringMock } from '../mocks/bringClientMock';
import { handleAddRecipeItemsToBringList } from '../../src/handlers';
import { mockListsResponse } from '../mocks/bringResponseMock';

tap.test('handleAddRecipeItemsToBringList', async (t) => {
  const validListId = 'list-1';
  const invalidListId = 'non-existent-list';
  const items = ['Butter', 'Sugar', 'Flour'];

  t.beforeEach(() => {
    resetBringMock();
  });

  t.test('should not add items when not confirmed', async (t) => {
    const parameters = {
      listId: validListId,
      items,
      confirm: false,
    };

    const response = await handleAddRecipeItemsToBringList(
      bringMock,
      parameters
    );

    t.match(response, {
      content: [
        {
          type: 'text',
          text: 'User did not confirm. No items were added to the Bring list.',
        },
      ],
    });
    t.equal(bringMock.getLists.callCount, 0);
    t.equal(bringMock.addItemToList.callCount, 0);
  });

  t.test('should add items when confirmed and list exists', async (t) => {
    bringMock.getLists.resolves(mockListsResponse);
    bringMock.addItemToList.resolves('');
    const parameters = {
      listId: validListId,
      items,
      confirm: true,
    };

    const response = await handleAddRecipeItemsToBringList(
      bringMock,
      parameters
    );

    t.match(response, {
      content: [
        {
          type: 'text',
          text: `Added items to list 'Groceries':\n- Butter\n- Sugar\n- Flour`,
        },
      ],
    });
    t.equal(bringMock.getLists.callCount, 1);
    t.equal(bringMock.addItemToList.callCount, 3);

    items.forEach((item, index) => {
      t.same(bringMock.addItemToList.getCall(index).args, [
        validListId,
        item,
        '',
      ]);
    });
  });

  t.test('should return error when list not found', async (t) => {
    bringMock.getLists.resolves(mockListsResponse);
    const parameters = {
      listId: invalidListId,
      items,
      confirm: true,
    };

    const response = await handleAddRecipeItemsToBringList(
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
    t.equal(bringMock.addItemToList.callCount, 0);
  });

  t.test('should handle error when getting lists', async (t) => {
    const errorMessage = 'Failed to get lists';
    bringMock.getLists.rejects(new Error(errorMessage));
    const parameters = {
      listId: validListId,
      items,
      confirm: true,
    };

    const response = await handleAddRecipeItemsToBringList(
      bringMock,
      parameters
    );

    t.match(response, {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
    });
  });

  t.test('should handle error when adding an item', async (t) => {
    const errorMessage = 'Failed to add item';
    bringMock.getLists.resolves(mockListsResponse);
    bringMock.addItemToList.rejects(new Error(errorMessage));
    const parameters = {
      listId: validListId,
      items,
      confirm: true,
    };

    const response = await handleAddRecipeItemsToBringList(
      bringMock,
      parameters
    );

    t.match(response, {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
    });
  });
});
