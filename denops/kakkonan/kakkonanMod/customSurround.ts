import { Vim } from "https://deno.land/x/denops_std@v0.14/mod.ts";
import { brackets } from "./brackets.ts";

export async function customSurroundBrackets(
  vim: Vim,
  inputBracket: string,
): Promise<void> {
  const customBrackets = await vim.eval("g:kakkonan_custom_brackets");

  if (customBrackets[inputBracket] === undefined) {
    console.log("please set custom brackets command");
    return;
  }
  await vim.execute("normal `<");

  const startLineNo = await vim.call("line", ".") as number;
  const startColNo = await vim.call("col", ".") as number;

  await vim.execute("normal `>");

  const finishLineNo = await vim.call("line", ".") as number;
  const finishColNo = await vim.call("col", ".") as number;

  const line = await vim.call("getline", ".") as string;

  if (startLineNo != finishLineNo) {
    const startLine = await vim.call("getline", startLineNo) as string;
    const finishLine = await vim.call("getline", finishLineNo) as string;

    const updateStartLine = startLine.slice(0, startColNo - 1) +
      customBrackets[inputBracket]["start"] +
      startLine.slice(startColNo - 1, startLine.length);
    const updateFinishLine = finishLine.slice(0, finishColNo) +
      customBrackets[inputBracket]["finish"] +
      finishLine.slice(finishColNo, finishLine.length);

    await vim.call("setline", startLineNo, updateStartLine);
    await vim.call("setline", finishLineNo, updateFinishLine);
    return;
  }

  const surroundText = line.slice(0, startColNo - 1) +
    customBrackets[inputBracket]["start"] +
    line.slice(startColNo - 1, finishColNo) +
    customBrackets[inputBracket]["finish"] +
    line.slice(finishColNo, line.length);

  await vim.call("setline", startLineNo, surroundText);

  return;
}
