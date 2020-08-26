/// Parses a display name from a hero info Model string
export function parseNameFromModel (modelString) {
    var dashSplit = modelString.split('.')[0].split('/');
    return dashSplit[dashSplit.length - 1];
};