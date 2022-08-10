import { Denops } from "https://deno.land/x/denops_std@v3.8.1/mod.ts";
import { backQuote, brackets, quotes } from "./brackets.ts";

export async function replaceBrackets(
  vim: Denops,
  inputBracket: string,
): Promise<void> {
  const fileLen = await vim.call("line", "$") as number;

  let cnt: number = 0;
  let quoteCnt: number = 0;

  let lineNo = await vim.call("line", ".") as number;
  const firstLineNo: number = lineNo;
  let colNo = await vim.call("col", ".") as number;

  const tmp = await vim.call("getline", lineNo) as string;
  const corsorChar = tmp[colNo - 1];

  if (!brackets[corsorChar]) {
    throw new Error(
      `Please hand off ['(', '[', '{', '"', ''', '${backQuote}']`,
    );
  }

  let finishFlg: boolean = false;
  let firstLine: boolean = true;

  while (!finishFlg) {
    const line = await vim.call("getline", lineNo) as string;

    const startCol = firstLine ? colNo - 1 : 0;

    for (let i = startCol; i < line.length; i++) {
      if (!quotes[corsorChar]) {
        if (line[i] === corsorChar) {
          cnt++;
        } else if (line[i] === brackets[corsorChar]) {
          cnt--;
        }
      } else {
        if (line[i] === corsorChar) {
          quoteCnt++;
        }
      }

      if (
        (!quotes[corsorChar] && cnt === 0) ||
        (quoteCnt === 2 && quotes[corsorChar])
      ) {
        if (firstLine) {
          let updateLine = line.slice(0, colNo - 1) + inputBracket +
            line.slice(colNo, i) + brackets[inputBracket] +
            line.slice(i + 1, line.length);

          await vim.call("setline", lineNo, updateLine);
          finishFlg = true;
          break;
        } else {
          const startLine = await vim.call(
            "getline",
            firstLineNo,
          ) as string;
          const finishLine = await vim.call("getline", lineNo) as string;

          const updateStartLine = startLine.slice(0, colNo - 1) +
            inputBracket +
            startLine.slice(colNo, startLine.length);
          const updateFinishLine = finishLine.slice(0, i - 1) +
            brackets[inputBracket] +
            finishLine.slice(i + 1, finishLine.length);

          await vim.call("setline", firstLineNo, updateStartLine);
          await vim.call("setline", lineNo, updateFinishLine);

          finishFlg = true;
          break;
        }
      }
    }

    if (lineNo === fileLen) {
      break;
    }

    lineNo++;
    firstLine = false;
  }
}
