// src/types/businessCentral.d.ts
interface JsonObject {
  [key: string]: any;
}

declare global {
   var Microsoft: {
    Dynamics?: {
      NAV?: {
        /**
         * Invokes an AL trigger on the Dynamics 365 Business Central service on the page that contains the control add-in.
         * @param name The name of the AL trigger to invoke.
         * @param arguments The arguments to pass to the AL trigger.
         * @param skipIfBusy A value to indicate whether to invoke the extensibility method if the client is busy. Default is false.
         * @param successCallback A function that is called when the extensibility method has finished execution on the server.
         * @param errorCallback A function that is called if an error occurs during the invocation.
         */
        InvokeExtensibilityMethod(
          name: string,
          arguments: any[],
          skipIfBusy?: boolean,
          successCallback?: () => void,
          errorCallback?: (error: Error) => void
        ): void;

        /**
         * Notifies the control add-in that it is ready to be used.
         */
        OnControlAddInReady?(): void;

        /**
         * Retrieves the URL for an image resource specified in the control add-in manifest.
         * @param imageName The name of the image resource to get a URL for.
         * @returns The URL for the specified image resource.
         */
        GetImageResource(imageName: string): string;

        /**
         * Retrieves the environment information for the control add-in.
         * @returns A JSON object containing environment information.
         */
        GetEnvironment(): JsonObject;

        /**
         * Retrieves the URL for a script resource specified in the control add-in manifest.
         * @param scriptName The name of the script resource to get a URL for.
         * @returns The URL for the specified script resource.
         */
        GetScriptResource(scriptName: string): string;

        /**
         * Retrieves the URL for a stylesheet resource specified in the control add-in manifest.
         * @param styleSheetName The name of the stylesheet resource to get a URL for.
         * @returns The URL for the specified stylesheet resource.
         */
        GetStyleSheetResource(styleSheetName: string): string;

        /**
         * Retrieves the URL for a web resource specified in the control add-in manifest.
         * @param webResourceName The name of the web resource to get a URL for.
         * @returns The URL for the specified web resource.
         */
        GetWebResource(webResourceName: string): string;

        /**
         * Retrieves the URL for a web service specified in the control add-in manifest.
         * @param webServiceName The name of the web service to get a URL for.
         * @returns The URL for the specified web service.
         */
        GetWebServiceResource(webServiceName: string): string;
      };
    };
  }
}

export {};
