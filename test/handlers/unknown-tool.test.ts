import { handleUnknownTool } from '../../src/handlers';
import tap from 'tap';

tap.test('handleUnknownTool', async (t) => {
  t.test('should return error for unknown tool', async (t) => {
    const unknownToolName = 'non-existent-tool';

    const response = handleUnknownTool(unknownToolName);

    t.match(response, {
      error: {
        type: 'not_found',
        message: `Unknown tool: ${unknownToolName}`,
      },
    });
  });
});
