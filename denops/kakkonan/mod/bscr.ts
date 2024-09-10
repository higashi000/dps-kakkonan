import type { Vim } from "jsr:@denops/std@7.1.1";
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
