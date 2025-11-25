page {{idStartRange}} "{{bcPageName}}"
{
    PageType = Card;
    ApplicationArea = All;
    UsageCategory = ReportsAndAnalysis;

    layout
    {
        area(Content)
        {
            usercontrol("{{bcPageName}}"; {{appName}}ControlAddIn) 
            {
                trigger ReceiveDataFromReact(messageData: Text)
                begin
                    message(messageData);
                end;

                trigger GetTable(tableNumber: Integer; maxRecords: Integer; filterField: Integer; filterText: Text)
                var
                    RecRef: RecordRef;
                    filterRef: FieldRef;
                    filterString: Text;
                    jsonHelper: Codeunit JsonHelper;
                    json: Codeunit Json;
                    rec: Variant;
                    data: Text;
                    jsonArray: JsonArray;
                    recordCounter: Integer;
                begin
                    RecRef.Open(tableNumber);
                    recordCounter := 0;

                    // Only apply filter if both filterField and filterText are provided
                    if (filterField > 0) and (filterText <> '') then begin
                        filterRef := RecRef.Field(filterField);
                        filterString := StrSubstNo('WHERE(%1=1(%2))', filterRef.Name, filterText);
                        RecRef.SetView(filterString);
                    end;
                    if RecRef.FindSet() then begin
                        jsonArray.Add(jsonHelper.RecordsToJsonArrayWithHeader(RecRef, maxRecords));
                    end;
                    jsonArray.WriteTo(data);
                    CurrPage.{{appName}}ControlAddIn.SendDataToReact(data);

                end;
             }
        }
    }

    actions
    {
        area(Navigation)
        {
            action(SendDataToReact)
            {
                ApplicationArea = All;

                trigger OnAction();
                var
                    JsonHelper: Codeunit JsonHelper;
                    customerRecord: Record Customer;
                    refRecord: RecordRef;
                    jsonArray: Text;
                begin
                    if customerRecord.FindSet() then begin
                        refRecord.GetTable(customerRecord);
                        jsonArray := JsonHelper.RecordToJsonArrayWithHeader(refRecord);
                        Message('JSON: %1', jsonArray);
                        CurrPage.{{bcPageName}}.SendDataToReact(jsonArray);
                    end;
                end;
            }
        }
    }
}