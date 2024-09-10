import { Denops } from "https://deno.land/x/denops_std@v7.0.2/mod.ts";
import { getLineChar } from "./getLineChar.ts";
import { backQuote, brackets, quotes } from "./brackets.ts";

export async function escapeBrackets(
  vim: Denops,
  inputBracket: unknown,
): Promise<boolean> {
  const cursorChar = await getLineChar(vim, -1);

  if (cursorChar == inputBracket) {
    return true;
  }

  return false;
}
