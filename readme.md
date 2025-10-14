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
```node ./scaffold.js```

Fill in the prompts. Script generates an extension:

- appNamne/
- react-app/
- app/
- postbuild.js

Open the app/ folder in its own workspace. AL requires the app.json file be in the project root.

```cd app/ && code .```

Download AL Symbols, Package the extension `Ctrl + ⇧ + P -> AL:Package`, and then deploy to the Sandbox: `Ctrl + ⇧ + P -> AL: Publish Without Debugging`. 

### Build Web App and add Minified js files to AL extension

The react app can be built locally using a dev server:
```npm run dev```

To build the react application using Typescript and add the minified code to the AL control add-in:
```npm run build```

This runs the postbuild.js script which removes the old js and css files and replaces them with the current build. It copies the minified js and css into the app/scripts folder and updates the control add-in with the new file names. 