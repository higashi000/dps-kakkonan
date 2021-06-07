import { main } from "https://deno.land/x/denops_std@v0.10/mod.ts";
import {
  backQuote,
  brackets,
  completion,
  escapeBrackets,
  getLineChar,
  quotes,
} from "./kakkonanMod/mod.ts";

main(async ({ vim }) => {
  vim.register({
    async kakkonanCompletion(inputBrackets: unknown): Promise<string> {
      if (typeof inputBrackets !== "string") {
        throw new Error(
          `'inputBrackets' attribute of 'kakkonanCompletion' in must be a string`,
        );
      }

      return await completion(vim, inputBrackets);
    },

    async kakkonanEscapeBrackets(inputBracket: unknown): Promise<boolean> {
      if (typeof inputBracket !== "string") {
        throw new Error(
          `'inputBrackets' attribute of 'kakkonanEscapeBrackets' in must be a string`,
        );
      }

      return await escapeBrackets(vim, inputBracket);
    },

    async kakkonanBackSpaceEnter(): Promise<boolean> {
      const cursorRight = await getLineChar(vim, -1);
      const cursorChar = await getLineChar(vim, -2);

      if (brackets[cursorChar] && brackets[cursorChar] == cursorRight) {
        return true;
      }

      return false;
    },

    async kakkonanSurroundBrackets(inputBracket: unknown): Promise<void> {
      if (typeof inputBracket !== "string") {
        throw new Error(
          `'inputBrackets' attribute of 'kakkonanSurroundBrackets' in must be a string`,
        );
      }

      if (!brackets[inputBracket]) {
        throw new Error(
          `Please hand off ['(', '[', '{', '"', ''', '${backQuote}']`,
        );
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
          inputBracket + startLine.slice(startColNo - 1, startLine.length);
        const updateFinishLine = finishLine.slice(0, finishColNo) +
          brackets[inputBracket] +
          finishLine.slice(finishColNo, finishLine.length);

        await vim.call("setline", startLineNo, updateStartLine);
        await vim.call("setline", finishLineNo, updateFinishLine);
        return;
      }

      const surroundText = line.slice(0, startColNo - 1) + inputBracket +
        line.slice(startColNo - 1, finishColNo) +
        brackets[inputBracket] + line.slice(finishColNo, line.length);

      await vim.call("setline", startLineNo, surroundText);

      return;
    },

    async kakkonanReplaceBrackets(inputBracket: unknown): Promise<void> {
      if (typeof inputBracket !== "string") {
        throw new Error(
          `'inputBrackets' attribute of 'kakkonanReplaceBrackets' in must be a string`,
        );
      }

      if (!brackets[inputBracket]) {
        throw new Error(
          `Please hand off ['(', '[', '{', '"', ''', '${backQuote}']`,
        );
      }

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
      return;
    },

    async kakkonanDeleteBrackets(): Promise<void> {
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
              const deletedText = line.slice(0, colNo - 1) +
                line.slice(colNo, i) +
                line.slice(i + 1, line.length);

              await vim.call("setline", lineNo, deletedText);
              finishFlg = true;
              break;
            } else {
              const startLine = await vim.call(
                "getline",
                firstLineNo,
              ) as string;
              const finishLine = await vim.call("getline", lineNo) as string;

              const updateStartLine = startLine.slice(0, colNo - 1) +
                startLine.slice(colNo, startLine.length);
              const updateFinishLine = finishLine.slice(0, i) +
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
      return;
    },
  });

  await vim.load(new URL("./script/keybind.vim", import.meta.url));

  console.log("dps-kakkonan has loaded");
});
