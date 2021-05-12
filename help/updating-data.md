# Updating /src/data/ JSON files

## Updating Data Files

Node is required to run the scripts locally.

1. Get all three npc_*.txt VDF files from ```path``` (np_abilities/npc_heroes/npc_units)
2. Extract ```neutral_items.txt``` from ```{DotA Root}/game/dota/Pak01_dir.vdf``` -> (Opened in [GCFScape](https://developer.valvesoftware.com/wiki/GCFScape)) ```"/root/scripts/npc/neutral_items.txt"``` and place inside any folder
3. Run the ```convert-npc-vdfs``` script inside ```NPM SCRIPTS``` to convert the VDF's to JSON
    * Configure the ```dota2BasePath``` property at the top with the base dota 2 directory
    * Set the ```neutralItemsFolderPath``` property to the folder directory you placed ```neutral_items.txt``` at
4. Done ;D