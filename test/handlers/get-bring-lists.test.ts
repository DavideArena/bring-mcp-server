import { bringMock, resetBringMock } from '../mocks/bringClientMock';
import { handleGetBringLists } from '../../src/handlers';
import { mockListsResponse } from '../mocks/bringResponseMock';
import { config } from '../../src/config';
import tap from 'tap';

tap.test('handleGetBringLists', async (t) => {
  t.beforeEach(() => {
    resetBringMock();
  });

  t.test('should return lists when found', async (t) => {
    bringMock.getLists.resolves(mockListsResponse);

    const response = await handleGetBringLists(bringMock);

    t.match(response, {
      content: [
        {
          type: 'text',
          text: `Lists for user '${config.BRING_EMAIL}':\n- Groceries (ID: list-1)\n- Hardware Store (ID: list-2)`,
        },
      ],
    });
    t.equal(bringMock.getLists.callCount, 1);
  });

  t.test('should handle error when getting lists', async (t) => {
    const errorMessage = 'Failed to get lists';
    bringMock.getLists.rejects(new Error(errorMessage));

    const response = await handleGetBringLists(bringMock);

    t.match(response, {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
    });
    t.equal(bringMock.getLists.callCount, 1);
  });
});
