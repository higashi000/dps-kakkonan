import { start } from "https://deno.land/x/denops_std@v0.2/mod.ts";

const brackets: { [name: string]: string} = {
    '(': ')',
    '{': '}',
    '[': ']',
    '"': '"',
    "'": "'",
    '`': '`',
}

const quotes: {[name: string]: string} = {
    '"': '"',
    "'": "'",
    '`': '`',
}

const backQuote = '`';

start(async (vim) => {
    const getLineChar = async (diff: number): Promise<string> => {
        const cursorStr = await vim.call('getline', '.') as string;

        const cursorCol = await vim.call('col', '.') as number;

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

        async kakkonanSurroundBrackets(inputBracket: unknown): Promise<void> {
            if (typeof inputBracket !== "string") {
                throw new Error(`'inputBrackets' attribute of 'kakkonanSurroundBrackets' in must be a string`);
            }

            if (!brackets[inputBracket]) {
                throw new Error(`Please hand off ['(', '[', '{', '"', ''', '${backQuote}']`);
            }

            await vim.execute('normal `<');

            const startLineNo = await vim.call("line", ".") as number;
            const startColNo = await vim.call("col", ".") as number;

            await vim.execute('normal `>');

            const finishLineNo = await vim.call("line", ".") as number;
            const finishColNo = await vim.call("col", ".") as number;

            const line = await vim.call("getline", ".") as string;

            if (startLineNo != finishLineNo) {
                const startLine = await vim.call("getline", startLineNo) as string;
                const finishLine = await vim.call("getline", finishLineNo) as string;

                const updateStartLine = startLine.slice(0, startColNo - 1) + inputBracket + startLine.slice(startColNo - 1, startLine.length);
                const updateFinishLine = finishLine.slice(0, finishColNo) + brackets[inputBracket] + finishLine.slice(finishColNo, finishLine.length);

                await vim.call("setline", startLineNo, updateStartLine);
                await vim.call("setline", finishLineNo, updateFinishLine);
                return;
            }

            const surroundText =
                line.slice(0, startColNo - 1) + inputBracket + line.slice(startColNo - 1, finishColNo) +
                brackets[inputBracket] + line.slice(finishColNo, line.length);

            await vim.call("setline", startLineNo, surroundText);

            return;
        },

        async kakkonanReplaceBrackets(inputBracket: unknown): Promise<void> {
            if (typeof inputBracket !== "string") {
                throw new Error(`'inputBrackets' attribute of 'kakkonanReplaceBrackets' in must be a string`);
            }

            if (!brackets[inputBracket]) {
                throw new Error(`Please hand off ['(', '[', '{', '"', ''', '${backQuote}']`);
            }
            
            let cnt: number = 0;
            let quoteCnt: number = 0;

            let lineNo = await vim.call("line", ".") as number;
            let colNo = await vim.call("col", ".") as number;

            const tmp = await vim.call("getline", lineNo) as string;
            const corsorChar = tmp[colNo - 1];

            if (!brackets[corsorChar]) {
                throw new Error(`Please hand off ['(', '[', '{', '"', ''', '${backQuote}']`);
            }


            let finishFlg: boolean = false;

            while (!finishFlg) {
                const line = await vim.call("getline", lineNo) as string;
                for (let i = colNo - 1; i < line.length; i++) { 
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

                    if ((!quotes[corsorChar] && cnt === 0) || (quoteCnt === 2 && quotes[corsorChar])) {
                        let updateLine = line.slice(0, colNo - 1) + inputBracket +
                            line.slice(colNo, i) + brackets[inputBracket] +
                            line.slice(i + 1, line.length);

                        await vim.call("setline", lineNo, updateLine);
                        finishFlg = true;
                        break;
                    }
                }

                lineNo++;
            }
            return;
        }
    });

    vim.execute(`
        inoremap <expr> ( denops#request("kakkonan", "kakkonanCompletion", ['(']) . "\<left>"
        inoremap <expr> { denops#request("kakkonan", "kakkonanCompletion", ['{']) . "\<left>"
        inoremap <expr> [ denops#request("kakkonan", "kakkonanCompletion", ['[']) . "\<left>"
        inoremap <expr> " denops#request("kakkonan", "kakkonanCompletion", ['"']) != "" ? '""' . "\<left>" : "\<right>"
        inoremap <expr> ' denops#request("kakkonan", "kakkonanCompletion", ["'"]) != "" ? "''" . "\<left>" : "\<right>"
        inoremap <expr> ${backQuote} denops#request("kakkonan", "kakkonanCompletion", ['${backQuote}']) != "" ? '${backQuote + backQuote}' . "\<left>" : "\<right>"

        inoremap <expr> ) denops#request("kakkonan", "kakkonanEscapeBrackets", [')']) == v:false ? ")" : "\<right>"
        inoremap <expr> } denops#request("kakkonan", "kakkonanEscapeBrackets", ['}']) == v:false ? "}" : "\<right>"
        inoremap <expr> ] denops#request("kakkonan", "kakkonanEscapeBrackets", [']']) == v:false ? "]" : "\<right>"

        inoremap <expr> <CR> denops#request("kakkonan", "kakkonanBackSpaceEnter", []) == v:false ? "\<CR>" : "\<CR>\<C-o>\<S-o>"

        inoremap <expr> <BS> denops#request("kakkonan", "kakkonanBackSpaceEnter", []) == v:false ? "\<BS>" : "\<BS>\<right>\<BS>"

        command! -range -nargs=1 KakkonanSurround :call denops#request("kakkonan", "kakkonanSurroundBrackets", [<f-args>])

        command! -range -nargs=1 KakkonanReplace :call denops#request("kakkonan", "kakkonanReplaceBrackets", [<f-args>])
    `);

    console.log('dps-kakkonan has loaded');
})
