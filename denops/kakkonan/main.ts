import { Denops } from "https://deno.land/x/denops_std@v3.8.1/mod.ts";
import { load } from "https://deno.land/x/denops_std@v3.8.1/helper/mod.ts";
import {
  backQuote,
  backSpaceEnter,
  brackets,
  completion,
  completionBackQuote,
  customSurroundBrackets,
  deleteBrackets,
  escapeBrackets,
  replaceBrackets,
  surroundBrackets,
} from "./mod/mod.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async kakkonanCompletion(inputBrackets: unknown): Promise<string> {
      if (typeof inputBrackets !== "string") {
        throw new Error(
          `'inputBrackets' attribute of 'kakkonanCompletion' in must be a string`,
        );
      }

      return await completion(denops, inputBrackets);
    },

    async kakkonanCompletionBackQuote(): Promise<string> {
      return await completionBackQuote(denops);
    },

    async kakkonanEscapeBrackets(inputBracket: unknown): Promise<boolean> {
      if (typeof inputBracket !== "string") {
        throw new Error(
          `'inputBrackets' attribute of 'kakkonanEscapeBrackets' in must be a string`,
        );
      }

      return await escapeBrackets(denops, inputBracket);
    },

    async kakkonanBackSpaceEnter(): Promise<boolean> {
      return await backSpaceEnter(denops);
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

      await surroundBrackets(denops, inputBracket);

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

      await replaceBrackets(denops, inputBracket);

      return;
    },

    async kakkonanDeleteBrackets(): Promise<void> {
      await deleteBrackets(denops);

      return;
    },

    async kakkonanCustomSurround(inputBracket: unknown): Promise<void> {
      if (typeof inputBracket !== "string") {
        throw new Error(
          `'inputBrackets' attribute of 'kakkonanReplaceBrackets' in must be a string`,
        );
      }

      await customSurroundBrackets(denops, inputBracket);
      return;
    },
  };

  console.log("dps-kakkonan has loaded");
}
