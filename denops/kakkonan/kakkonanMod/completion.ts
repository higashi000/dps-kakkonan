import { Vim } from "https://deno.land/x/denops_std@v0.10/mod.ts";
import { getLineChar } from "./getLineChar.ts";
import { backQuote, brackets, quotes } from "./brackets.ts";

export async function completion(
  vim: Vim,
  inputBrackets: string,
): Promise<string> {
  if (typeof inputBrackets !== "string") {
    throw new Error(
      `'inputBrackets' attribute of 'kakkonanCompletion' in must be a string`,
    );
  }

  const cursorChar = await getLineChar(vim, -1);

  if (
    inputBrackets == '"' || inputBrackets == "'" || inputBrackets == "`"
  ) {
    if (cursorChar == inputBrackets) {
      return "";
    }
  }

  if (brackets[inputBrackets]) {
    return inputBrackets + brackets[inputBrackets];
  }

  return "";
}
