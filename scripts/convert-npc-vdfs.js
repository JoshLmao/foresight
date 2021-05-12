/*
    Converts the Valve VDF format to a usable JSON file format.
    Also converts the AbilitySpecial property in npc_abilities.txt to a JSON array.

    Configure the config paths before executing!
*/



/*** CONFIG ***/

// Path of root dota 2 installation (content/game/etc)
let dota2BasePath = "D:/Program Files/Steam/steamapps/common/dota 2 beta";

// Relative file path from dota 2 base directory
let npcFolderPath = dota2BasePath + "/game/dota/scripts/npc/";
// Files to convert inside the npcFolderPath
let npc_files = [
    "npc_abilities",
    "npc_heroes",
    "npc_units"
];

// Folder path of the extracted 'neutral_items.txt' vdf from inside "{DotA Root}/game/dota/Pak01_dir.vdf"
// Open with GCFScape, then navigate to "/root/scripts/npc/neutral_items.txt"
// https://developer.valvesoftware.com/wiki/GCFScape
let neutralItemsFolderPath = "D:/";

// Output folder to create/replace converted JSON files
let foresightFolderPath = "/src/data/dota2/json/";

/*** END CONFIG ***/



// Require VDF to JSON converter
vdf = require('simple-vdf');
const fs = require('fs')

// Reads a single file at the path and returns the content
function readSingleFile(filePath) {
    if (!filePath) {
      return;
    }
    
    let content;
    content = fs.readFileSync(filePath, 'utf8')
    
    return content;
}

// Writes the content to a file, replacing if one exists
function writeSingleFile (filePath, content) {
    if (!filePath || !content) {
        return;
    }
    
    let success = fs.writeFileSync(filePath, content, { encoding: 'utf8', flag: 'w'});
}

// Convert the AbilitySpecial array ( which uses VDF array keys like "00": value, "01": value, etc)
// to a JSON array (like [ value, value, value, etc ])
function convertAbilitySpecialArray(jsonData) {
    if (!jsonData) {
        return;
    }
    try
    {
        // get all keys and base object of DOTAAbilities
        let abilityKeys = Object.keys(jsonData.DOTAAbilities);
        let abilityObjBase = jsonData.DOTAAbilities;
        
        if (abilityKeys) {
            // Iterate through all Ability keys
            for(let i = 0; i < abilityKeys.length; i++) {
                let key = abilityKeys[i];
                let abilObj = abilityObjBase[key];
                // If ability has an AbilitySpecial
                if (abilObj.AbilitySpecial) {
                    if (abilObj.AbilitySpecial == null) {
                        continue;
                    }
                
                    // Convert VDF array to JSON once
                    // https://stackoverflow.com/a/49764565/11593118
                    abilObj.AbilitySpecial  = Object.entries(abilObj.AbilitySpecial)
                        .filter(([key, value]) => Number(key)) // Filter non numeric keys
                        .map(([, value]) => value); // We only keep the value, not the key
                }
            }
        }
    } 
    catch (err) 
    {
        console.log(`ERROR '${fileName}': ` + err.message);
        return;
    }

    return jsonData;
}

function stringifyJsonObj (jsonObj) {
    return JSON.stringify(jsonObj, null, '    ');
}

console.log("Beginning conversion & updating of VDF to JSON");

// Iterate through each file
for (let fileName of npc_files) 
{
    // Build path
    let filePath = npcFolderPath + fileName + ".txt";
    console.log("Converting file: " + filePath);
    // Read in VDF file contents
    let vdfContent = readSingleFile(filePath);
    // Convert from VDF to JSON
    let jsonData = vdf.parse(vdfContent);

    // Check JSON is valid before proceeding
    if(jsonData) {
        
        // Convert AbilitySpecial for npc_abilities file
        if (fileName === "npc_abilities") {
            jsonData = convertAbilitySpecialArray(jsonData);
        }

        // Combine paths of current directory, plus folder path and name
        let jsonPath = process.cwd() + foresightFolderPath + fileName + ".json";
        // Stringify with 4 spaces as separator
        let stringified = stringifyJsonObj(jsonData, null, '    ');
        // Write stringify'd JSON to file
        writeSingleFile(jsonPath, stringified);

        console.log("Successfully converted file to location: " + jsonPath);
    }
}

console.log("Converting neutral_items.txt");

let neutralItemsFileName = "neutral_items";
let neutralItemsPath = neutralItemsFolderPath + neutralItemsFileName + ".txt";
// Read in neutral_items text
let itmsText = readSingleFile(neutralItemsPath);
if (itmsText) {
    // Convert from text VDF to JSON
    let itmsJSONObject = vdf.parse(itmsText);
    if (itmsJSONObject) {
        // Convert VDF array to JSON array 
        try 
        {
            itmsJSONObject.neutral_items = Object.entries(itmsJSONObject.neutral_items)
                    .filter(([key, value]) => Number(key)) // Filter non numeric keys
                    .map(([, value]) => value); // We only keep the value, not the key
        } 
        catch (err)
        {
            console.log(`ERROR: ${neutralItemsFileName}: ${err.message}`);
            return;
        }

        let itmsJsonPath = process.cwd() + foresightFolderPath + neutralItemsFileName + ".json";
        let stringified = stringifyJsonObj(itmsJSONObject);
        // Write stringify'd JSON to file
        writeSingleFile(itmsJsonPath, stringified);
    }
}

console.log("Completed conversion.");