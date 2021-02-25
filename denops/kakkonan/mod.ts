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

        const cursorStr = await vim.call('getline', '.');
        if (typeof cursorStr !== "string") {
            throw new Error(`'cursorStr' attribute of 'kakkonanCompletion' in must be a string`)
        }

        const cursorLine = await vim.call('line', '.');
        if (typeof cursorLine !== "number") {
            throw new Error(`'cursorLine' attribute of 'kakkonanCompletion' in must be a number`)
        }

        const cursorCol = await vim.call('col', '.');
        if (typeof cursorCol !== "number") {
            throw new Error(`'cursorCol' attribute of 'kakkonanCompletion' in must be a number`)
        }

        const cursorChar = cursorStr.substr(cursorCol + diff, 1);

        return cursorChar;
    }

    vim.register({
        async kakkonanCompletion(inputBrackets: unknown): Promise<string> {
            if (typeof inputBrackets !== "string") {
                throw new Error(`'inputBrackets' attribute of 'kakkonanCompletion' in must be a string`)
            }

            const cursorChar = await getLineChar(-1);

            if (inputBrackets == '"' || inputBrackets == "'" || inputBrackets == "`") {
                if (cursorChar == inputBrackets) {
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

            const cursorChar = await getLineChar(-1);

            if (cursorChar == inputBracket) {
                return true;
            }

            return false;
        },

        async kakkonanBackSpaceEnter(): Promise<boolean> {
            const cursorRight =  await getLineChar(-1);
            const cursorChar = await getLineChar(-2);

            if (brackets[cursorChar] && brackets[cursorChar] == cursorRight) {
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

    console.log('dps-kakkonan has loaded');
})
