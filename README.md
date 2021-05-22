# dps-kakkonan
Brackets completion plugin, using the denops.vim.
This plugin respect for [cohama/lexima.vim](https://github.com/cohama/lexima.vim) and [machakann/vim-sandwich](https://github.com/machakann/vim-sandwich).

# Install
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
After, please execute `'<,'>KakkonanSurround $brackets`.<br>
[![Image from Gyazo](https://i.gyazo.com/5a26d3728eab1dadf90b6c15a6aea632.gif)](https://gyazo.com/5a26d3728eab1dadf90b6c15a6aea632)

## Delete brackets
Select text in visual mode.<br>
After, please execute `'<,'>KakkonanDelete`.<br>
[![Image from Gyazo](https://i.gyazo.com/8fd7611abd5748bcdf5da53b443eacd3.gif)](https://gyazo.com/8fd7611abd5748bcdf5da53b443eacd3)
