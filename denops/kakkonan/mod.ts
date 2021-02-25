import { start } from "https://deno.land/x/denops_std@v0.2/mod.ts";

const brackets: { [name: string]: string} = {
    '(': ')',
    '{': '}',
    '[': ']',
    '"': '"',
    "'": "'",
    '`': '`',
}

const backQuote = '`';

start(async (vim) => {
    const getLineChar = async (diff: number): Promise<string> => {
        if (typeof diff !== "number") {
            throw new Error(`'diff' attribute of 'getLineChar' in must be a number`)
        }

        const corsorStr = await vim.call('getline', '.');
        if (typeof corsorStr !== "string") {
            throw new Error(`'corsorStr' attribute of 'kakkonanCompletion' in must be a string`)
        }

        const corsorLine = await vim.call('line', '.');
        if (typeof corsorLine !== "number") {
            throw new Error(`'corsorLine' attribute of 'kakkonanCompletion' in must be a number`)
        }

        const corsorCol = await vim.call('col', '.');
        if (typeof corsorCol !== "number") {
            throw new Error(`'corsorCol' attribute of 'kakkonanCompletion' in must be a number`)
        }

        const corsorChar = corsorStr.substr(corsorCol + diff, 1);

        return corsorChar;
    }

    vim.register({
        async kakkonanCompletion(inputBrackets: unknown): Promise<string> {
            if (typeof inputBrackets !== "string") {
                throw new Error(`'inputBrackets' attribute of 'kakkonanCompletion' in must be a string`)
            }

            const corsorChar = await getLineChar(-1);

            if (inputBrackets == '"' || inputBrackets == "'" || inputBrackets == "`") {
                if (corsorChar == inputBrackets) {
                    return "";
                }
            }

            if (brackets[inputBrackets]) {
                return inputBrackets + brackets[inputBrackets];
            }

            return "";
        },

        async kakkonanEscapeBrackets(inputBracket: unknown): Promise<boolean> {
            if (typeof inputBracket !== "string") {
                throw new Error(`'inputBrackets' attribute of 'kakkonanEscapeBrackets' in must be a string`);
            }

            const corsorChar = await getLineChar(-1);

            if (corsorChar == inputBracket) {
                return true;
            }

            return false;
        },

        async kakkonanBackSpaceEnter(): Promise<boolean> {
            const corsorRight =  await getLineChar(-1);
            const corsorChar = await getLineChar(-2);

            if (brackets[corsorChar] && brackets[corsorChar] == corsorRight) {
                return true;
            }

            return false;
        },
    })

    // completion brackets and some quote
    vim.execute(`inoremap <expr> ( denops#request("kakkonan", "kakkonanCompletion", ['(']) . "\<left>"`);
    vim.execute(`inoremap <expr> { denops#request("kakkonan", "kakkonanCompletion", ['{']) . "\<left>"`);
    vim.execute(`inoremap <expr> [ denops#request("kakkonan", "kakkonanCompletion", ['[']) . "\<left>"`);
    vim.execute(`inoremap <expr> " denops#request("kakkonan", "kakkonanCompletion", ['"']) != "" ? '""' . "\<left>" : "\<right>"`);
    vim.execute(`inoremap <expr> ' denops#request("kakkonan", "kakkonanCompletion", ["'"]) != "" ? "''" . "\<left>" : "\<right>"`);
    vim.execute(`inoremap <expr> ${backQuote} denops#request("kakkonan", "kakkonanCompletion", ['${backQuote}']) != "" ? '${backQuote + backQuote}' . "\<left>" : "\<right>"`);
    // escape some brackets
    vim.execute(`inoremap <expr> ) denops#request("kakkonan", "kakkonanEscapeBrackets", [')']) == v:false ? ")" : "\<right>"`);
    vim.execute(`inoremap <expr> } denops#request("kakkonan", "kakkonanEscapeBrackets", ['}']) == v:false ? "}" : "\<right>"`);
    vim.execute(`inoremap <expr> ] denops#request("kakkonan", "kakkonanEscapeBrackets", [']']) == v:false ? "]" : "\<right>"`);

    // input enter
    vim.execute(`inoremap <expr> <CR> denops#request("kakkonan", "kakkonanBackSpaceEnter", []) == v:false ? "\<CR>" : "\<CR>\<C-o>\<S-o>"`);

    // input backspace
    vim.execute(`inoremap <expr> <BS> denops#request("kakkonan", "kakkonanBackSpaceEnter", []) == v:false ? "\<BS>" : "\<BS>\<right>\<BS>"`);
})
