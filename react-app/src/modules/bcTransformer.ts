// BC Record Types
export interface BCField {
  id: number;
  name: string;
  type: string;
  value: any;
}

export interface BCPrimaryKey {
  fieldCount: number;
  fields: BCField[];
}

export interface BCRecord {
  id: number;
  name: string;
  company: string;
  position: string;
  recordId: string;
  primaryKey: BCPrimaryKey;
  fields: BCField[];
}

export interface SimpleRecord {
  recordLine: number;
  tableName: string;
  company: string;
  recordId: string;
  [key: string]: any;
}

// Helper: convert to camelCase
function toCamelCase(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
    index === 0 ? word.toLowerCase() : word.toUpperCase()
  ).replace(/\s+/g, '');
}

// Transform BC's complex structure to simple flat object
export function flattenBCRecord(bcRecord: BCRecord): SimpleRecord {
  const flattened: SimpleRecord = {
    recordLine: bcRecord.primaryKey.fields[0].value,
    tableName: bcRecord.name,
    company: bcRecord.company,
    recordId: bcRecord.recordId
  };

  // Add all fields as top-level properties (camelCase for easier React use)
  bcRecord.fields.forEach(field => {
    flattened[toCamelCase(field.name)] = field.value;
  });

  return flattened;
}

// Transform array of BC records
export function flattenBCRecords(bcRecords: BCRecord[]): SimpleRecord[] {
  return bcRecords.map(flattenBCRecord);
}

// Convert BC record back to complex structure for sending to BC
export function unflattenToBCRecord(
  simpleRecord: SimpleRecord,
  originalBCRecord: BCRecord
): BCRecord {
  // Create fresh fields array with updated values
  const updatedFields = originalBCRecord.fields.map(field => {
    const camelName = toCamelCase(field.name);
    // Create new field object to avoid reference issues
    return {
      ...field,
      value: simpleRecord[camelName] ?? field.value
    };
  });

  // Create fresh primary key fields
  const updatedPrimaryKey: BCPrimaryKey = {
    ...originalBCRecord.primaryKey,
    fields: originalBCRecord.primaryKey.fields.map(pkField => ({
      ...pkField,
      value: simpleRecord[toCamelCase(pkField.name)] ?? pkField.value
    }))
  };

  // Create completely new record object
  return {
    ...originalBCRecord,
    recordId: simpleRecord.recordId ?? originalBCRecord.recordId,
    primaryKey: updatedPrimaryKey,
    fields: updatedFields
  };
}

// Convert array of simple records back to BC format
export function unflattenToBCRecords(
  simpleRecords: SimpleRecord[],
  originalBCRecords: BCRecord[]
): BCRecord[] {
  const originalsById = new Map(
    originalBCRecords.map(r => [r.recordId, r])
  );

  return simpleRecords.map((simpleRecord, index) => {
    const matchingOriginal =
      (simpleRecord.recordId && originalsById.get(simpleRecord.recordId)) ||
      originalBCRecords[index] ||
      originalBCRecords[0];

    return unflattenToBCRecord(simpleRecord, matchingOriginal);
  });
}

// Parse BC JSON string and return flattened records
export function parseBCJson(jsonString: string): SimpleRecord[] {
  try {
    const bcRecords: BCRecord[] = JSON.parse(jsonString);
    return flattenBCRecords(bcRecords);
  } catch (error) {
    console.error('Error parsing BC JSON:', error);
    return [];
  }
}

// Convert simple records back to BC JSON string
export function serializeToBCJson(
  simpleRecords: SimpleRecord[],
  originalBCRecords: BCRecord[]
): string {
  try {
    // Debug logging
    console.log('Input simple records:', simpleRecords);
    console.log('Original BC records:', originalBCRecords);

    const bcRecords = unflattenToBCRecords(simpleRecords, originalBCRecords);
    
    // Debug logging
    console.log('Output BC records:', bcRecords);
    
    return JSON.stringify(bcRecords);
  } catch (error) {
    console.error('Error serializing to BC JSON:', error);
    return '[]';
  }
}