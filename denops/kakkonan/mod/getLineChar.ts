import { Denops } from "https://deno.land/x/denops_std@v7.0.2/mod.ts";

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
