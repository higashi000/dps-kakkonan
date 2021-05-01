import { Vim } from "https://deno.land/x/denops_std@v0.10/mod.ts";

export async function getLineChar(vim: Vim, diff: number): Promise<string> {
  const cursorStr = await vim.call("getline", ".") as string;

  const cursorCol = await vim.call("col", ".") as number;

  const cursorChar = cursorStr.substr(cursorCol + diff, 1);

  return cursorChar;
}
