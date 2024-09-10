import type { Denops } from "jsr:@denops/std@7.1.1";

export async function getLineChar(vim: Denops, diff: number): Promise<string> {
  const cursorStr = await vim.call("getline", ".") as string;

  const cursorCol = await vim.call("col", ".") as number;

  const cursorChar = await vim.call(
    "matchstr",
    cursorStr,
    ".",
    cursorCol + diff,
  );

  return cursorChar;
}
