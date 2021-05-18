/*
    Converts the Valve VDF format to a usable JSON file format.
    Able to convert:
    npc_abilities, npc_heroes, npc_units, items.json, abilities_{language}, dota_{langauge}
    Also converts the AbilitySpecial property in npc_abilities.txt to a JSON array.

    Configure the config paths before executing!
    Note: All config paths that are folder paths require a '/' at the end to indicate its a path
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

// Folder path of extracted localized VDF's from in pak01_dir.vpk
let languageFolderPath = "D:/foresight-extracts/";
// Languages after dota_{language} or abilities_{language} in file name
let languages = [
    "english",
    "schinese"
];

// Folder path which contans all extracted files from pak01_dir.vpk
let pakExtractsFolderPath = "D:/foresight-extracts/";

// Output folder in repository to create/replace converted JSON files
let foresightFolderPath = process.cwd() + "/src/data/dota2/json/";
// Output folder in repository to create/replace language locale files
let foresightLocaleFolderPath = process.cwd() + "/src/data/dota2/languages/";

/*** END CONFIG ***/



// Require VDF to JSON converter
vdf = require('simple-vdf');
const fs = require('fs');

// Reads a single file at the path and returns the content
function readSingleFile(filePath) {
    if (!filePath) {
      return;
    }
    return fs.readFileSync(filePath, 'utf8');
}

// Writes the content to a file, replacing if one exists
function writeSingleFile (filePath, content) {
    if (!filePath || !content) {
        return;
    }
    let success = fs.writeFileSync(filePath, content, { encoding: 'utf8', flag: 'w'});
}
// Checks if a file exists
function fileExists(filePath) {
    if (!filePath) {
        return false;
    }
    return fs.existsSync(filePath);
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
    if (!fileExists(filePath)) {
        console.error(`File '${filePath}' doesn't exists. Skipping...`);
        continue;
    }
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
        let jsonPath = foresightFolderPath + fileName + ".json";
        // Stringify with 4 spaces as separator
        let stringified = stringifyJsonObj(jsonData);
        // Write stringify'd JSON to file
        writeSingleFile(jsonPath, stringified);

        console.log("Successfully converted file to location: " + jsonPath);
    }
}

console.log("Completed conversion of npc files");

console.log("-----");

console.log("Beginning conversion of localized files...");

//languageFolderPath
let localizedFiles = [
    "dota_",
    "abilities_"
];
for(let lang of languages)
{
    for(let locFile of localizedFiles) 
    {
        // Build full path - Root folder path + dota_ + language + .txt
        let localeFileName = `${locFile}${lang}`;
        let currentFilePath = `${languageFolderPath}${localeFileName}.txt`;
        if (!fileExists(currentFilePath)) {
            console.error(`File '${currentFilePath}' doesn't exists. Skipping...`);
            continue;
        }

        // Get content and attempt JSON parse
        let fileContents = readSingleFile(currentFilePath);
        let jsonObject = vdf.parse(fileContents);
        if (jsonObject) {
            // Build output file path, stringify and write
            let outputFilePath = `${foresightLocaleFolderPath}${localeFileName}.json`;
            let stringified = stringifyJsonObj(jsonObject);
            writeSingleFile(outputFilePath, stringified);

            console.log(`Successfully converted localized file '${localeFileName}'`);
        }
        else {
            console.error(`ERROR: ${localeFileName} - unable to parse VDF`);
        }
    }
}

console.log("Completed conversion of localized files!")

console.log("-----");

console.log("Converting items.json");

let itemsFileName = "items";
let itemsFilePath = pakExtractsFolderPath + itemsFileName + ".txt";
// Check file exists
if (fileExists(itemsFilePath)) {
    // Parse file for text
    let vdfText = readSingleFile(itemsFilePath);
    if (vdfText) {
        // Convert VDF text to json object
        let itemsJSONObject = vdf.parse(vdfText);
        if (itemsJSONObject) {
            // Convert AbilitySpecial of items to JSON array
            itemsJSONObject = convertAbilitySpecialArray(itemsJSONObject);
            // Build output path and stringify
            let jsonPath = foresightFolderPath + itemsFileName + ".json";
            let stringified = stringifyJsonObj(itemsJSONObject);
            // Write stringify'd JSON to file
            writeSingleFile(jsonPath, stringified);

            console.log("Successfully converted items.json");
        }
    }
} else {
    console.error(`File '${itemsFilePath}' doesn't exists. Skipping...`);
}

console.log("Completed conversion of items.json");

console.log("-----");

console.log("Converting neutral_items.txt");

// Build file path to neutral_items.json extracted from pak01_dir.vpk
let neutralItemsFileName = "neutral_items";
let neutralItemsPath = pakExtractsFolderPath + neutralItemsFileName + ".txt";

// Check file exists before continuing...
if (fileExists(neutralItemsPath)) {
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

            let itmsJsonPath = foresightFolderPath + neutralItemsFileName + ".json";
            let stringified = stringifyJsonObj(itmsJSONObject);
            // Write stringify'd JSON to file
            writeSingleFile(itmsJsonPath, stringified);
        }
    }
} else {
    console.error(`File '${neutralItemsPath}' doesn't exists. Skipping...`);
}

console.log("Completed conversion.");