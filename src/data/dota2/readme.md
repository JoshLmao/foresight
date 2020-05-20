# DotA 2 Data: Useful Paths & Tools

All paths start at the default install directory of Dota 2.

#### "game/dota 2 beta/game/dota/scripts/npc"

- npc_heroes.txt
- npc_abilities.txt
- npc_units.txt

## Pak01_dir.vpk

You will need [GCFScape](https://developer.valvesoftware.com/wiki/GCFScape) to access .vpk

#### "materials/vgui/hud"

- minimap_hero_sheet_psd_*.vtex_c
- minimap_hero_sheet.vmat

#### "resource/localization/*"

- abilities_english.txt
- dota_english.txt

#### "root/scripts/npc/*"

- items.txt
- neutral_items.txt

#### "root/panarama/images/heroes"

- npc_dota_hero_*_png

## Converting .vdf to .json

To convert the Valve .vdf file format to .json, you need to use the [online VDF-Parser](https://rgp.io/vdf-parser/). Then, to convert the outputted JSON arrays to native JSON arrays, [use this JSFiddle](https://jsfiddle.net/JoshLmao/c6shzam0/6/)

## Packing Images into Spritesheet

You can use [Stitches](https://draeton.github.io/stitches/) by Draeton to merge many images into one stylesheet. Once complete, click "Downloads" and download both stylesheet and spritesheet. Replace the data inside the stylesheet with a url to the spritesheet inside public