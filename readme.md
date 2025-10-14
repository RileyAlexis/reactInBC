# Scaffold for React 19 inside an extension for Microsoft Dynamics 365 Business Central

Stack:
    - Vite 7.1.7
    - React 19.1.9
    - Typescript 5.9.3
    - Business Central Runtime 15.0
    - BC Platform 26.0

This template spins up a basic React web application inside an Application Language Extension to run a web application inside business central. It creates one BC page with a control add-in in order to run the minified javascript. 

## Usage:

Prequisites:
 - Node/npm
 - VsCode with the Application Language extension from Microsoft

Download the scaffold.js node script and run:
```node ./scaffold.js

Fill in the prompts. Script generates an extension:

<appNamne>/
 --react-app/
 --app/
 --postbuild.js

```cd app/ && code .

Download AL Symbols, Package the extension `Ctrl + ⇧ + P -> AL:Package`, and then deploy to the Sandbox: `Ctrl + ⇧ + P -> AL: Publish Without Debugging`. 
