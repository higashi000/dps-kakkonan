inoremap <expr> ( denops#request("kakkonan", "kakkonanCompletion", ['(']) . "\<left>"
inoremap <expr> { denops#request("kakkonan", "kakkonanCompletion", ['{']) . "\<left>"
inoremap <expr> [ denops#request("kakkonan", "kakkonanCompletion", ['[']) . "\<left>"
inoremap <expr> " denops#request("kakkonan", "kakkonanCompletion", ['"']) != "" ? '""' . "\<left>" : "\<right>"
inoremap <expr> ' denops#request("kakkonan", "kakkonanCompletion", ["'"]) != "" ? "''" . "\<left>" : "\<right>"
inoremap <expr> ` denops#request("kakkonan", "kakkonanCompletion", ['`']) != "" ? '``' . "\<left>" : "\<right>"

inoremap <expr> ) denops#request("kakkonan", "kakkonanEscapeBrackets", [')']) == v:false ? ")" : "\<right>"
inoremap <expr> } denops#request("kakkonan", "kakkonanEscapeBrackets", ['}']) == v:false ? "}" : "\<right>"
inoremap <expr> ] denops#request("kakkonan", "kakkonanEscapeBrackets", [']']) == v:false ? "]" : "\<right>"

inoremap <expr> <CR> denops#request("kakkonan", "kakkonanBackSpaceEnter", []) == v:false ? "\<CR>" : "\<CR>\<C-o>\<S-o>"

inoremap <expr> <BS> denops#request("kakkonan", "kakkonanBackSpaceEnter", []) == v:false ? "\<BS>" : "\<BS>\<right>\<BS>"

command! -range -nargs=1 KakkonanSurround :call denops#request("kakkonan", "kakkonanSurroundBrackets", [<f-args>])

command! -range KakkonanDelete :call denops#request("kakkonan", "kakkonanDeleteBrackets", [])

command! -range -nargs=1 KakkonanReplace :call denops#request("kakkonan", "kakkonanReplaceBrackets", [<f-args>])

