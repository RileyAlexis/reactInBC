#!/bin/bash
set -e

# 1️⃣ Prompt for variables
read -p "ControlAddIn Name (appName): " APP_NAME
APP_NAME=${APP_NAME: -MyApp}
read -p "Publisher: " PUBLISHER
PUBLISHER=${PUBLISHER: -MyCompany}
read -p "bcPageName: " BCPAGENAME
BCPAGENAME=${BCPAGENAME: -MyPage}
read -p "tenantID: " TENANTID
TENANTID=${TENANTID: -TenantID}
read -p "idStartRange: " idStartRange
idStartRange=${idStartRange: 50100}
read -p "idEndRange: " idEndRange
idEndRange=${idEndRange: 50150}


# 2️⃣ Clone the template repo
TEMPLATE_REPO="https://github.com/RileyAlexis/reactInBC.git"
DEST_DIR="$APP_NAME"
git clone "$TEMPLATE_REPO" "$DEST_DIR"

cd "$DEST_DIR"

# 3️⃣ Replace placeholders in all files
echo "Replacing placeholders..."
find . -type f -exec sed -i "s/{{appName}}/$APP_NAME/g" {} +
find . -type f -exec sed -i "s/{{publisher}}/$PUBLISHER/g" {} +

# 4️⃣ Install dependencies and build React app
cd react-app
npm install
npm run build

# 5️⃣ Copy build files into AL project
cd ..
mkdir -p app/scripts
cp -r react-app/dist/assets/* app/scripts/

# 6️⃣ Update ControlAddIn AL file
AL_FILE=$(find app/ControlAddIns -name "*ControlAddIn.al" | head -n 1)
if [ -z "$AL_FILE" ]; then
    echo "❌ ControlAdd
