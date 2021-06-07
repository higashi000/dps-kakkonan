import { Vim } from "https://deno.land/x/denops_std@v0.10/mod.ts";
import { getLineChar } from "./getLineChar.ts";
import { backQuote, brackets, quotes } from "./brackets.ts";

export async function escapeBrackets(
  vim: Vim,
  inputBracket: unknown,
): Promise<boolean> {
  const cursorChar = await getLineChar(vim, -1);

  if (cursorChar == inputBracket) {
    return true;
  }

  return false;
}
