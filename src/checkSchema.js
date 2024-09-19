function checkSchema(schema) {
  // load schema from schema.json and check input matches the types listed
  try {
    const schemaFile = require('./schema.json');
    const inputKeys = Object.keys(schema);
    const schemaKeys = Object.keys(schemaFile.properties);
    const schemaTypes = Object.values(schemaFile.properties).map((x) => x.type);
    const inputTypes = Object.values(schema).map((x) => typeof x);
    if (inputKeys.length !== schemaKeys.length) {
      return { result: false, error: 'Input keys do not match schema keys' };
    }
    for (let i = 0; i < schemaKeys.length; i++) {
      if (inputKeys[i] !== schemaKeys[i] || inputTypes[i] !== schemaTypes[i]) {
        if (schemaTypes[i] === 'integer' && inputTypes[i] === 'number') {
          continue;
        } else {
          return {
            result: false,
            error: `Input type mismatch for ${inputKeys[i]} (it is '${inputTypes[i]}' but should be '${schemaTypes[i]}')`,
          };
        }
      }
    }
    return { result: true };
  } catch (error) {
    return { result: false, error: 'Error checking schema', errorDetails: error };
  }
}

module.exports = { checkSchema };
