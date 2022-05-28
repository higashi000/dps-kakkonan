import { Denops } from "https://deno.land/x/denops_std@v3.3.1/mod.ts";

export async function getLineChar(vim: Denops, diff: number): Promise<string> {
  const cursorStr = await vim.call("getline", ".") as string;

  const cursorCol = await vim.call("col", ".") as number;
  console.log(cursorCol);

  //const cursorChar = cursorStr.substr(cursorCol + diff, 1);

  const cursorChar = await vim.call(
    "matchstr",
    cursorStr,
    ".",
    cursorCol + diff,
  );

  return cursorChar;
}
