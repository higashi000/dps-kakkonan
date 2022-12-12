import { Denops } from "https://deno.land/x/denops_std@v3.8.1/mod.ts";
import { execute } from "https://deno.land/x/denops_std@v3.8.1/helper/mod.ts";
import { brackets } from "./brackets.ts";

export async function surroundBrackets(
  vim: Denops,
  inputBracket: string,
): Promise<void> {
  await execute(vim, "normal `<");

  let startColNo: number;
  if (await vim.call("has", "nvim")) {
    const line = await vim.call("getline", ".") as string;
    const pos = await vim.call("getpos", ".") as number[];
    const col = await vim.call("charidx", line, pos[2]);
    const byteCol = await vim.call("byteidx", line, col);

    if (byteCol === pos[2]) {
      startColNo = col;
    } else {
      startColNo = col + 1;
    }
  } else {
    const pos = await vim.call("getcharpos", ".");

    startColNo = pos[2] + 1;
  }

  const startLineNo = await vim.call("line", ".") as number;

  await execute(vim, "normal `>");

  const finishLineNo = await vim.call("line", ".") as number;
  let isEnd = false;

  const pos = await vim.call("getcharpos", ".");

  const finishColNo = pos[2];

  const line = await vim.call("getline", ".") as string;

  // 複数行を一気に囲もうとするとバグる
  // TODO: 原因調査
  if (startLineNo != finishLineNo) {
    const startLine = await vim.call("getline", startLineNo) as string;
    const finishLine = await vim.call("getline", finishLineNo) as string;

    const updateStartLine = startLine.slice(0, startColNo - 1) +
      inputBracket + startLine.slice(startColNo - 1, startLine.length);
    const updateFinishLine = finishLine.slice(0, finishColNo) +
      brackets[inputBracket] +
      finishLine.slice(finishColNo, finishLine.length);

    await vim.call("setline", startLineNo, updateStartLine);
    await vim.call("setline", finishLineNo, updateFinishLine);
    return;
  }

  let surroundText = "";
  if (!isEnd) {
    surroundText = line.slice(0, startColNo - 1) + inputBracket +
      line.slice(startColNo - 1, finishColNo) +
      brackets[inputBracket] + line.slice(finishColNo, line.length);
  } else {
    surroundText = line.slice(0, startColNo - 1) + inputBracket +
      line.slice(startColNo - 1, line.length) + brackets[inputBracket];
  }
  await vim.call("setline", startLineNo, surroundText);

  return;
}
