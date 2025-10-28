codeunit {{idStartRange}} JsonHelper
{
   SingleInstance = true;
    procedure RecordToJsonArray(var Rec: RecordRef): Text
    var
        JsonArray: Text;
        JsonObj: Text;
        FieldRef: FieldRef;
        FirstRecord: Boolean;
        i: Integer;
        FieldName: Text;
    begin
        JsonArray := '[';
        FirstRecord := true;
        if Rec.FindSet() then
            repeat
                if not FirstRecord then
                    JsonArray += ',';
                JsonObj := '{';
                for i := 1 to Rec.FieldCount() do begin
                    FieldRef := Rec.FieldIndex(i);
                    if i > 1 then
                        JsonObj += ',';
                    // Remove spaces from field name
                    FieldName := FieldRef.Name;
                    FieldName := FieldName.Replace(' ', '');
                    FieldName := FieldName.Replace('.', '');
                    FieldName := FieldName.Replace('-', '_');
                    JsonObj += '"' + FieldName + '":';
                    case FieldRef.Type of
                        FieldType::Boolean:
                            if FieldRef.Value then
                                JsonObj += 'true'
                            else
                                JsonObj += 'false';
                        FieldType::Integer,
                        FieldType::BigInteger,
                        FieldType::Decimal:
                            JsonObj += Format(FieldRef.Value);
                        else
                            JsonObj += '"' + EscapeString(Format(FieldRef.Value)) + '"';
                    end;
                end;
                JsonObj += '}';
                JsonArray += JsonObj;
                FirstRecord := False;
            until Rec.Next() = 0;
        JsonArray += ']';
        exit(JsonArray);
    end;

    procedure JsonToRecord(var Rec: RecordRef; JsonString: Text): Boolean
    var
        JsonObject: JsonObject;
        JsonToken: JsonToken;
        FieldRef: FieldRef;
        i: Integer;
        FieldName: Text;
        FieldValue: Text;
    begin
        if not JsonObject.ReadFrom(JsonString) then
            exit(false);

        // Loop through all fields in the record
        for i := 1 to Rec.FieldCount() do begin
            FieldRef := Rec.FieldIndex(i);
            FieldName := FieldRef.Name.Replace(' ', '');

            // Try to find matching key in JSON (without spaces)
            if JsonObject.Get(FieldName, JsonToken) then begin
                FieldValue := JsonToken.AsValue().AsText();

                // Set field value based on type
                case FieldRef.Type of
                    FieldType::Boolean:
                        FieldRef.Value := (FieldValue = 'true') or (FieldValue = '1');
                    FieldType::Integer,
                    FieldType::BigInteger:
                        FieldRef.Value := FieldValue;
                    FieldType::Decimal:
                        FieldRef.Value := FieldValue;
                    else
                        FieldRef.Value := FieldValue;
                end;
            end;
        end;

        exit(true);
    end;

    local procedure EscapeString(Value: Text): Text
    begin
        Value := StrSubstNo(Value, '\', '\\');   // escape backslash first
        Value := StrSubstNo(Value, '"', '\"');   // escape double quotes
        Value := StrSubstNo(Value, '\n', '\\n'); // escape newlines
        Value := StrSubstNo(Value, '\r', '\\r'); // escape carriage returns
        Value := StrSubstNo(Value, '\t', '\\t'); // escape tabs
        exit(Value);
    end;
}