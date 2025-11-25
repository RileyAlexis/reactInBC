# React 19 in Microsoft Business Central

This template creates a basic Business Central Application Language Control Add In page using React 19. It contains necessary functions for pulling data from a Business Central SaaS instance and saving it as JSON to facilitate local development. It also creates the basic functions for passing data between React and BC. 

Current development has React being read only for tables. 

## Scripts

- scaffold.js - Download and run this file using Node in order to build the template application. It will place the BC Application Language extension in the app/ folder with the React application in react-app/. 

### Building

To build and deploy run ```react-app/npm run build```. Once the typescript is built the postbuild script will run. This takes the built and minified javascript and CSS and updates the AL Control Add In file names to use the updated React code. Then build with the AL Language Extension (Package + Publish) to upload the extension to a Business Central SaaS sandbox instance. 

### Dependencies

Requires Node and Vite plus access to a Microsoft Business Central SaaS system with an account that has Super User permissions (required for uploading extensions).

### Data

The React App defaults to displaying the GetMockData component. Once published to Business Central this allows the downloading of records in JSON format from any table. Entering 0 in the MaxRecords field will download the entire table, which can be a large amount of data depending on the table. Clicking the download button downloads the JSON table data which can be saved in the ```public/mockData``` folder. This allows local development using the standard Vite/Node dev server since the react-app checks for localhost and then substitutes the JSON files for data received directly from BC. 