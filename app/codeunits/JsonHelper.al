codeunit {{idStartRange}} JsonHelper
{
    SingleInstance = true;

    procedure RecordToJsonArray(var Rec: RecordRef): Text
    var
        JsonArray: Text;
        JsonObj: TExt;
        FieldRef: FieldRef;
        FirstRecord: Boolean;
        i: Integer;
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

                    JsonObj += '"' + FieldRef.Name + '":';

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