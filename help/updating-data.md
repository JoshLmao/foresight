# Updating /src/data/ JSON files

Running any NPM Scripts requires the installation of [node.js](https://nodejs.org/en/)

## Useful DotA 2 Data Paths

[PathsHelp.md](../src/data/dota2/readme.md)

## Using ```convert-vdfs``` script to update data files

Steps to update all data files required for foresight.

1. Get all three npc_*.txt VDF files from ```game/dota 2 beta/game/dota/scripts/npc``` (npc_abilities/npc_heroes/npc_units)
2. Extract ```neutral_items.txt``` from ```{DotA Root}/game/dota/Pak01_dir.vdf``` -> (Opened in [GCFScape](https://developer.valvesoftware.com/wiki/GCFScape)) ```"/root/scripts/npc/neutral_items.txt"``` and place inside any folder
3. Extract necessary ```dota_``` and ```ability_``` language files from ```{DotA Root}/game/dota/Pak01_dir.vdf``` -> (Opened in [GCFScape](https://developer.valvesoftware.com/wiki/GCFScape)) ```root/resource/localization/``` and place inside any folder
4. Run the ```convert-vdfs``` script inside ```NPM SCRIPTS``` to convert the VDF's to JSON
    * Configure the ```dota2BasePath``` property at the top with the base dota 2 directory
    * Set the ```neutralItemsFolderPath``` property to the folder directory you placed ```neutral_items.txt``` at
    * Configure the ```languageFolderPath``` property with the folder where you extracted the ```dota_``` and ```ability_``` locale files

## Updating Hero Sprites

Steps to update hero spritesheet in foresight

1. Extract all hero icons (...png.vtex_c) from inside ```pak01_dir.vpk```
2. Convert ```...png_.vtex_c``` to .png using [VRF](https://vrf.steamdb.info/) command line
    * Use the command ```Decompiler.exe --input "{input_folder}" --output "{output_folder}"```
3. Use [Stitches](https://draeton.github.io/stitches/) to merge images into one stylesheet using the following settings:
    * **Style Prefix:** hero-icon-big
    * **Padding:** 0px
    - Once Complete,  open "Settings", "Downloads" tab, then download CSS and Spritesheet
4. Replace ```/public/images/dota2/heroes_sheet.png``` with the stylesheet and ```src/css/dota_hero_icons_big.css``` with the CSS file
5. Edit the CSS with the follow at the top:
```
.hero-icon-big {
    background-image: url("/images/dota2/heroes_sheet.png");
    background-repeat: no-repeat;
    display: block;
}
```

## Updating Item Sprites

Follow the same steps as "Updating Hero Sprites" but extract all items located inside ```pak01_dir.vpk``` at ```root/panarama/images/items/```. However, set the **Style Prefix:** to ```dota-item```.
Also replace the top ```.dota-item``` in the CSS file with
```
.dota-item {
    background-image: url("/images/dota2/items_sheet.png");
    background-repeat: no-repeat;
    display: block;
}
```

## Update UI DotA Version

Update the ```dotaVersion``` property in ```package.json``` once finished updating.