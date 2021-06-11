import { main } from "https://deno.land/x/denops_std@v0.10/mod.ts";
import {
  backQuote,
  backSpaceEnter,
  brackets,
  completion,
  deleteBrackets,
  escapeBrackets,
  replaceBrackets,
  surroundBrackets,
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
      return await backSpaceEnter(vim);
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

      await surroundBrackets(vim, inputBracket);

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

      await replaceBrackets(vim, inputBracket);

      return;
    },

    async kakkonanDeleteBrackets(): Promise<void> {
      await deleteBrackets(vim);

      return;
    },
  });

  await vim.load(new URL("./script/keybind.vim", import.meta.url));

  console.log("dps-kakkonan has loaded");
});
