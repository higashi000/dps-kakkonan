import { Vim } from "https://deno.land/x/denops_std@v0.10/mod.ts";
import { getLineChar } from "./getLineChar.ts";
import { brackets } from "./brackets.ts";

export async function backSpaceEnter(vim: Vim): Promise<boolean> {
  const cursorRight = await getLineChar(vim, -1);
  const cursorChar = await getLineChar(vim, -2);

  if (brackets[cursorChar] && brackets[cursorChar] == cursorRight) {
    return true;
  }

  return false;
}
