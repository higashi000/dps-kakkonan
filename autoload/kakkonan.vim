let s:save_cpo = &cpo
set cpo&vim

function! kakkonan#completionBackQuote() abort
  let s:completionResult = denops#request("kakkonan", "kakkonanCompletionBackQuote", [])

  if s:completionResult == ''
    return "\<right>"
  elseif s:completionResult == '``'
    return '``' . "\<left>"
  elseif s:completionResult == '```'
    return '````' . "\<left>\<left>\<left>"
  endif
endfunction

let &cpo = s:save_cpo
unlet s:save_cpo
