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

                trigger GetTable(tableNumber: Integer; filterField: Integer; filterText: Text)
                var
                    RecRef: RecordRef;
                    filterRef: FieldRef;
                    filterString: Text;
                    jsonHelper: Codeunit JsonHelper;
                    jsonReader: Codeunit "Json Text Reader/Writer";
                    json: Codeunit Json;
                    rec: Variant;
                    jsonManage: Codeunit "JSON Management";
                    data: Text;
                    jsonArray: JsonArray;
                    recordCounter: Integer;

                begin
                    RecRef.Open(tableNumber);
                    recordCounter := 0;
                    if filterField > 0 then begin
                        filterRef := RecRef.Field(filterField);

                        Message('%1 - %2', filterRef.value, filterText);

                        filterString := StrSubstNo('WHERE(%1=1(%2))', filterRef.Name, filterText);
                        RecRef.SetView(filterString);
                    end;


                    if RecRef.FindSet() then begin

                        repeat
                            jsonArray.Add(jsonHelper.RecordToJson(RecRef));
                            recordCounter += 1;
                        until (RecRef.Next() = 0) or (recordCounter = 10);
                    end;
                    jsonArray.WriteTo(data);

                    CurrPage.WarehouseMover.SendDataToReact(data);

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
                        jsonArray := JsonHelper.RecordToJsonArray(refRecord);
                        Message('JSON: %1', jsonArray);
                        CurrPage.{{bcPageName}}.SendDataToReact(jsonArray);
                    end;
                end;
            }
        }
    }
}