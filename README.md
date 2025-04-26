# Bring MCP Server

A Model Context Protocol (MCP) server that integrates with Bring Shopping Lists API, allowing AI assistants to manage shopping lists through natural language.

> **Disclaimer:** This project uses unofficial Bring APIs that are not publicly documented or supported. These APIs could change without notice, potentially breaking functionality. Use at your own risk.

## Overview

This project implements a full featured Model Context Protocol (MCP) server in TypeScript that connects to the Bring Shopping Lists API. It enables AI assistants like Claude, ChatGPT, and others to interact with your Bring shopping lists through a standardized protocol.

## Features

- **MCP Protocol Support**: Implements the Model Context Protocol for seamless integration with AI assistants
- **Stdio Transport**: Compatible with Claude for Desktop and other MCP enabled clients
- **Bring API Integration**: Complete Bring Shopping List API integration with the following capabilities:
  - List all shopping lists
  - Get items from a shopping list
  - Add recipe items to a shopping list
  - Remove specific items or clear entire shopping lists
  - Get detailed information about list items
  - View all users who have access to a shopping list

## Prerequisites

- Bring account (email and password)
- Bring API key

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd bring-mcp-server
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the project root with the following variables:

   ```md
   BRING_EMAIL=your_bring_account_email
   BRING_PASSWORD=your_bring_account_password
   BRING_API_KEY=your_bring_api_key
   ```

4. Build the project:

   ```md
   npm run build
   ```

## Usage

### Starting the Server

Start the MCP server with:

```sh
node dist/index.js
```

The server will connect via stdio, making it compatible with MCP clients like Claude for Desktop.

### Connecting to Claude for Desktop

1. Configure Claude for Desktop to use this MCP server
2. In your Claude conversation, you can now interact with your Bring shopping lists

### Available MCP Tools

The server exposes the following tools to MCP clients:

| Tool Name                            | Description                                        |
| ------------------------------------ | -------------------------------------------------- |
| `get-bring-lists`                    | List all shopping lists for the authenticated user |
| `get-bring-list-items`               | Get all items from a specific shopping list        |
| `add-recipe-items-to-bring-list`     | Add multiple items to a shopping list at once      |
| `remove-item-or-all-from-bring-list` | Remove a specific item or clear an entire list     |
| `get-bring-list-items-details`       | Get detailed information about items in a list     |
| `get-all-users-from-bring-list`      | List all users who have access to a specific list  |

## Development

### Running in Development Mode

```sh
npm run dev
```

This starts the server with hot reloading for development.

## VS Code Integration

For VS Code integration, see the `.vscode/mcp.sample.json` file. This configuration allows VS Code to connect to the MCP server directly.

## Testing

Run the full test suite with:

```sh
npm test
```

### Continuous Integration

The project uses GitHub Actions for continuous integration. Automated tests are run on each push to the main branch and on pull requests.

You can view the workflow configuration in `.github/workflows/test.yml`.

### Test Structure

Tests are organized in the `test/` directory:

- `handlers/` - Contains tests for each MCP tool handler
- `mocks/` - Contains mock implementations used in tests

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

For feature requests or bug reports, please open an issue on the project repository.
