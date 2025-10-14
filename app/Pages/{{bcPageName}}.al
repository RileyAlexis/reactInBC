page {{idStartRange}} "{{bcPageName}}"
{
    PageType = Card;
    ApplicationArea = All;
    UsageCategory = ReportsAndAnalysis;

    layout
    {
        area(Content)
        {
            usercontrol("{{bcPageName}}"; {{appName}}ControlAddIn) { }
        }
    }
}