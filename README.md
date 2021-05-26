# dps-kakkonan
Brackets completion plugin, using the denops.vim.<br>
This plugin respect for [cohama/lexima.vim](https://github.com/cohama/lexima.vim) and [machakann/vim-sandwich](https://github.com/machakann/vim-sandwich).<br>

# Install
Please install [deno](https://deno.land/).
After, install plugins as follows.
dein.vim
```
call dein#add('vim-denops/denops.vim')
call dein#add('higashi000/dps-kakkonan')
```

# Usage
## Completion Brackets
Please input some brackets in insert mode.<br>
[![Image from Gyazo](https://i.gyazo.com/977511c3215785e40f41329fdabb5bb4.gif)](https://gyazo.com/977511c3215785e40f41329fdabb5bb4)

## Surround text to brackets
Select text in visual mode.<br>
After, please execute keybind that you set up.<br>
example<br>
```
" dps-kakkonan surround text to backets example keymap
vmap sr( <Plug>(dps_kakkonan_surround_parenthesis)
vmap sr{ <Plug>(dps_kakkonan_surround_curly)
vmap sr[ <Plug>(dps_kakkonan_surround_square)
vmap sr" <Plug>(dps_kakkonan_surround_doublequote)
vmap sr' <Plug>(dps_kakkonan_surround_singlequote)
vmap sr` <Plug>(dps_kakkonan_surround_backquote)
```
demo<br>
[![Image from Gyazo](https://i.gyazo.com/642cdff83f7767d16b35af9a208a751b.gif)](https://gyazo.com/642cdff83f7767d16b35af9a208a751b)

## Delete brackets
Select text in visual mode.<br>
After, please execute `'<,'>KakkonanDelete`.<br>
[![Image from Gyazo](https://i.gyazo.com/8fd7611abd5748bcdf5da53b443eacd3.gif)](https://gyazo.com/8fd7611abd5748bcdf5da53b443eacd3)

## Replace brackets
Please set your keymap.<br>
example<br>
```
" dps-kakkonan replace brackets example keymap
map rp( <Plug>(dps_kakkonan_replace_parenthesis)
map rp{ <Plug>(dps_kakkonan_replace_curly)
map rp[ <Plug>(dps_kakkonan_replace_square)
map rp" <Plug>(dps_kakkonan_replace_doublequote)
map rp' <Plug>(dps_kakkonan_replace_singlequote)
map rp` <Plug>(dps_kakkonan_replace_backquote)
```
demo<br>
[![Image from Gyazo](https://i.gyazo.com/9788368e06d751f4adc0b50958eec300.gif)](https://gyazo.com/9788368e06d751f4adc0b50958eec300)
