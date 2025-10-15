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