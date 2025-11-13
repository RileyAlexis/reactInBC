controladdin {{appName}}ControlAddIn
{
    Scripts = 'scripts/index-Dv9QCkJa.js';
    StyleSheets = 'scripts/index-D8b4DHJx.css';
    RequestedHeight = 0;
    RequestedWidth = 0;
    VerticalStretch = true;
    HorizontalStretch = true;

    procedure SendDataToReact(messageData: Text);
    event ReceiveDataFromReact(messageData: Text);
    event GoToPage(i: Integer);
    event GetTable(tableNumber: Integer; filterField: Integer; filterText: Text);
}