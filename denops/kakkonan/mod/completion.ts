import { Denops } from "https://deno.land/x/denops_std@v3.8.1/mod.ts";
import { getLineChar } from "./getLineChar.ts";
import { backQuote, brackets, quotes } from "./brackets.ts";

export async function completion(
  vim: Denops,
  inputBrackets: string,
): Promise<string> {
  if (typeof inputBrackets !== "string") {
    throw new Error(
      `'inputBrackets' attribute of 'kakkonanCompletion' in must be a string`,
    );
  }

  const cursorChar = await getLineChar(vim, -1);

  if (
    ['"', "'", "`"].includes(inputBrackets)
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
