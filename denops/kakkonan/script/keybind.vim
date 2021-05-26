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
vnoremap <silent> <Plug>(dps_kakkonan_surround_parenthesis) :call denops#request("kakkonan", "kakkonanSurroundBrackets", ['('])<CR>
vnoremap <silent> <Plug>(dps_kakkonan_surround_curly) :call denops#request("kakkonan", "kakkonanSurroundBrackets", ['{'])<CR>
vnoremap <silent> <Plug>(dps_kakkonan_surround_square) :call denops#request("kakkonan", "kakkonanSurroundBrackets", ['['])<CR>
vnoremap <silent> <Plug>(dps_kakkonan_surround_doublequote) :call denops#request("kakkonan", "kakkonanSurroundBrackets", ['"'])<CR>
vnoremap <silent> <Plug>(dps_kakkonan_surround_singlequote) :call denops#request("kakkonan", "kakkonanSurroundBrackets", ["'"])<CR>
vnoremap <silent> <Plug>(dps_kakkonan_surround_backquote) :call denops#request("kakkonan", "kakkonanSurroundBrackets", ["`"])<CR>


command! -range KakkonanDelete :call denops#request("kakkonan", "kakkonanDeleteBrackets", [])

command! -range -nargs=1 KakkonanReplace :call denops#request("kakkonan", "kakkonanReplaceBrackets", [<f-args>])
noremap <silent> <Plug>(dps_kakkonan_replace_parenthesis) :call denops#request("kakkonan", "kakkonanReplaceBrackets", ['('])<CR>
noremap <silent> <Plug>(dps_kakkonan_replace_square) :call denops#request("kakkonan", "kakkonanReplaceBrackets", ['['])<CR>
noremap <silent> <Plug>(dps_kakkonan_replace_curly) :call denops#request("kakkonan", "kakkonanReplaceBrackets", ['{'])<CR>
noremap <silent> <Plug>(dps_kakkonan_replace_doublequote) :call denops#request("kakkonan", "kakkonanReplaceBrackets", ['"'])<CR>
noremap <silent> <Plug>(dps_kakkonan_replace_singlequote) :call denops#request("kakkonan", "kakkonanReplaceBrackets", ["'"])<CR>
noremap <silent> <Plug>(dps_kakkonan_replace_backquote) :call denops#request("kakkonan", "kakkonanReplaceBrackets", ['`'])<CR>
