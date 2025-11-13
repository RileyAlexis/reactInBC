codeunit 50261 ReactTableManagement
{
    procedure runUpdatesFromReact(JsonArrayString: Text)
    var
        RecRef: RecordRef;
        jsonArray: JsonArray;
        jsonToken: JsonToken;
        tableNameToken: JsonToken;
        i: Integer;
        tableNumber: Integer;
    begin
        // Parse the JSON array from React
        if not jsonArray.ReadFrom(JsonArrayString) then begin
            Error('Failed to parse JSON from React');
        end;
        if jsonArray.Count() = 0 then begin
            Error('No records to update');
        end;
        // Get table number from first record
        jsonArray.Get(0, jsonToken);

        if not jsonToken.AsObject().Contains('name') then begin
            Error('JSON does not contain table name. JSON: ' + Format(jsonToken));
        end;

        jsonToken.AsObject().Get('name', tableNameToken);
        tableNumber := GetTableNumberFromName(tableNameToken.AsValue().AsText());

        RecRef.Open(tableNumber);
        // Process each record
        for i := 0 to jsonArray.Count() - 1 do begin
            jsonArray.Get(i, jsonToken);
            UpdateOrInsertRecord(RecRef, jsonToken.AsObject());
        end;
        RecRef.Close();
        Message('Records updated successfully');
    end;

    local procedure UpdateOrInsertRecord(var RecRef: RecordRef; jsonObject: JsonObject)
    var
        recordLine: Integer;
        jsonToken: JsonToken;
        valueToken: JsonToken;
        fieldRef: FieldRef;
        fieldsArray: JsonArray;
    begin
        // Get record line from primaryKey.fields[0].value
        if not jsonObject.Get('primaryKey', jsonToken) then
            Error('primaryKey field is required');

        if not jsonToken.AsObject().Get('fields', jsonToken) then
            Error('fields array not found in primaryKey');

        fieldsArray := jsonToken.AsArray();
        fieldsArray.Get(0, jsonToken);

        if not jsonToken.AsObject().Get('value', valueToken) then
            Error('value not found in primaryKey field');

        recordLine := valueToken.AsValue().AsInteger();

        // Find record using primary key
        fieldRef := RecRef.FieldIndex(1);
        fieldRef.SetRange(recordLine);

        if RecRef.FindFirst() then begin
            // Update existing record
            UpdateRecordFields(RecRef, jsonObject);
            if not RecRef.Modify(true) then
                Error('Failed to modify record');
        end else begin
            // Insert new record
            RecRef.Init();
            fieldRef.Value := recordLine;
            SetRecordFields(RecRef, jsonObject);
            if not RecRef.Insert(true) then
                Error('Failed to insert record');
        end;
    end;

    local procedure UpdateRecordFields(var RecRef: RecordRef; jsonObject: JsonObject)
    var
        fieldRef: FieldRef;
        fieldsArray: JsonArray;
        fieldToken: JsonToken;
        fieldObjToken: JsonToken;
        valueToken: JsonToken;
        nameToken: JsonToken;
        fieldName: Text;
        i: Integer;
    begin
        if not jsonObject.Get('fields', fieldToken) then
            exit;

        fieldsArray := fieldToken.AsArray();

        foreach fieldObjToken in fieldsArray do begin
            if fieldObjToken.AsObject().Get('name', nameToken) then begin
                fieldName := nameToken.AsValue().AsText();

                // Try to find field by name by iterating through fields
                for i := 1 to RecRef.FieldCount do begin
                    fieldRef := RecRef.FieldIndex(i);
                    if fieldRef.Name = fieldName then begin
                        if fieldObjToken.AsObject().Get('value', valueToken) then begin
                            if not valueToken.AsValue().IsNull() then
                                SetFieldValue(fieldRef, valueToken.AsValue());
                        end;
                        break;
                    end;
                end;
            end;
        end;

        if not RecRef.Modify(true) then
            Error('Failed to modify record %1', RecRef.RecordId);
    end;

    local procedure SetRecordFields(var RecRef: RecordRef; jsonObject: JsonObject)
    var
        fieldRef: FieldRef;
        fieldCount: Integer;
        i: Integer;
        fieldName: Text;
        fieldsArray: JsonArray;
        fieldToken: JsonToken;
        fieldObjToken: JsonToken;
        valueToken: JsonToken;
        j: Integer;
    begin
        // Get fields array from JSON
        if not jsonObject.Contains('fields') then begin
            exit;
        end;

        jsonObject.Get('fields', fieldToken);
        fieldsArray := fieldToken.AsArray();

        // Loop through fields array and set record
        for j := 0 to fieldsArray.Count() - 1 do begin
            fieldsArray.Get(j, fieldObjToken);
            fieldObjToken.AsObject().Get('name', fieldToken);
            fieldName := fieldToken.AsValue().AsText();

            // Find matching field in record and set
            fieldCount := RecRef.FieldCount();
            for i := 1 to fieldCount do begin
                fieldRef := RecRef.FieldIndex(i);
                if fieldRef.Name = fieldName then begin
                    fieldObjToken.AsObject().Get('value', valueToken);
                    if not valueToken.AsValue().IsNull() then begin
                        SetFieldValue(fieldRef, valueToken.AsValue());
                    end;
                end;
            end;
        end;
    end;

    local procedure SetFieldValue(var fieldRef: FieldRef; jsonValue: JsonValue)
    begin
        case fieldRef.Type() of
            FieldType::Integer, FieldType::BigInteger:
                fieldRef.Value := jsonValue.AsInteger();
            FieldType::Decimal:
                fieldRef.Value := jsonValue.AsDecimal();
            FieldType::Boolean:
                fieldRef.Value := jsonValue.AsBoolean();
            else
                fieldRef.Value := jsonValue.AsText();
        end;
    end;

    local procedure GetJsonFieldValue(jsonObject: JsonObject; fieldName: Text): Text
    var
        jsonToken: JsonToken;
    begin
        if jsonObject.Get(fieldName, jsonToken) then begin
            if not jsonToken.AsValue().IsNull() then begin
                exit(Format(jsonToken.AsValue()));
            end;
        end;
        exit('');
    end;

    local procedure GetTableNumberFromName(tableName: Text): Integer
    begin
        // Map table names to numbers - extend as needed
        case tableName of
            'PurisUsers':
                exit(50260);
            'Item':
                exit(27);
            else
                Error('Unknown table: ' + tableName);
        end;
    end;
}