import { Denops } from "https://deno.land/x/denops_std@v2.0.0/mod.ts";

export async function getLineChar(vim: Denops, diff: number): Promise<string> {
  const cursorStr = await vim.call("getline", ".") as string;

  const cursorCol = await vim.call("col", ".") as number;
  console.log(cursorCol)

  //const cursorChar = cursorStr.substr(cursorCol + diff, 1);

  const cursorChar = await vim.call("matchstr", cursorStr, ".", cursorCol + diff);


  return cursorChar;
}
