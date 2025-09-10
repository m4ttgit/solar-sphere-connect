import { useCallback } from 'react';

export interface McpToolArgs {
  [key: string]: unknown;
}

export const useMcpTool = () => {
  const executeTool = useCallback(async (serverName: string, toolName: string, args: McpToolArgs) => {
    try {
      const response = await fetch('/.mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          server_name: serverName,
          tool_name: toolName,
          arguments: args,
        }),
      });

      if (!response.ok) {
        throw new Error(`MCP HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("MCP Tool Execution Error:", error.message);
        throw error;
      } else {
        console.error("MCP Tool Execution Error: An unknown error occurred");
        throw new Error("An unknown error occurred");
      }
    }
  }, []);

  return { executeTool };
};
