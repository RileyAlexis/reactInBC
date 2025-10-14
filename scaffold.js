#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

// Helper for prompts with default values
function prompt(question, defaultValue) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const q = `${question} [${defaultValue}]: `;
    rl.question(q, answer => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

(async () => {
  // 1️⃣ Prompt for variables
  const appName = await prompt("ControlAddIn Name (appName)", "MyApp");
  const publisher = await prompt("Publisher", "MyCompany");
  const bcPageName = await prompt("BC Page Name", "MyPage");
  const tenantID = await prompt("Tenant ID", "TenantID");
  const idStartRange = await prompt("ID Start Range", "50100");
  const idEndRange = await prompt("ID End Range", "50150");

  // 2️⃣ Clone template repo
  const TEMPLATE_REPO = "https://github.com/RileyAlexis/reactInBC.git";
  const DEST_DIR = path.resolve(appName);
  console.log(`Cloning template into ${DEST_DIR}...`);
  execSync(`git clone ${TEMPLATE_REPO} "${DEST_DIR}"`, { stdio: "inherit" });

  // 3️⃣ Replace placeholders recursively
    function replacePlaceholders(dir) {
      for (const file of fs.readdirSync(dir)) {
        if (file === ".git") continue; // skip git folder
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          replacePlaceholders(filePath);
        } else if (stat.isFile()) {
          let content = fs.readFileSync(filePath, "utf8");
          content = content
            .replace(/{{appName}}/g, appName)
            .replace(/{{publisher}}/g, publisher)
            .replace(/{{bcPageName}}/g, bcPageName)
            .replace(/{{tenantID}}/g, tenantID)
            .replace(/{{idStartRange}}/g, idStartRange)
            .replace(/{{idEndRange}}/g, idEndRange);
          fs.writeFileSync(filePath, content, "utf8");
        }
      }
    } 


  console.log("Replacing placeholders...");
  replacePlaceholders(DEST_DIR);

  // 4️⃣ Install React dependencies and build
  console.log("Installing React dependencies...");
  execSync("npm install", { cwd: path.join(DEST_DIR, "react-app"), stdio: "inherit" });

  console.log("Building React app...");
  execSync("npm run build", { cwd: path.join(DEST_DIR, "react-app"), stdio: "inherit" });

  // 5️⃣ Copy build files into AL project
  const srcAssets = path.join(DEST_DIR, "react-app/dist/assets");
  const targetScripts = path.join(DEST_DIR, "app/scripts");
  fs.mkdirSync(targetScripts, { recursive: true });
  for (const file of fs.readdirSync(srcAssets)) {
    const ext = path.extname(file).toLowerCase();
    if (ext !== ".js" && ext !== ".css") continue; // skip other file types
    fs.copyFileSync(path.join(srcAssets, file), path.join(targetScripts, file));
  }

  // 6️⃣ Update ControlAddIn AL file
  const alDir = path.join(DEST_DIR, "app/ControlAddIns");
  const alFiles = fs.readdirSync(alDir).filter(f => f.toLowerCase().includes("controladdin") && f.endsWith(".al"));
  if (alFiles.length === 0) {
    console.error("❌ No ControlAddIn .al file found");
    process.exit(1);
  }

  const alFilePath = path.join(alDir, alFiles[0]);
  let alContent = fs.readFileSync(alFilePath, "utf8");

    function replaceOrInsert(sectionName, files) {
      // Match Scripts = '...' or Scripts = "..." (single or double quotes)
      const regex = new RegExp(`${sectionName}\\s*=\\s*['"][^'"]*['"]`, 'g');

      // Use single quotes for the new section
      const newSection = `${sectionName} = '${files.join("', '")}'`;

      if (regex.test(alContent)) {
        alContent = alContent.replace(regex, newSection);
      } else {
        // If the section doesn't exist, insert before closing brace
        alContent = alContent.replace(/\}$/, `    ${newSection}\n}`);
      }
    }


  const jsFiles = fs.readdirSync(targetScripts).filter(f => f.endsWith(".js")).map(f => `scripts/${f}`);
  const cssFiles = fs.readdirSync(targetScripts).filter(f => f.endsWith(".css")).map(f => `scripts/${f}`);

  replaceOrInsert("Scripts", jsFiles);
  replaceOrInsert("StyleSheets", cssFiles);

  fs.writeFileSync(alFilePath, alContent, "utf8");

  console.log("✅ Scaffold complete!");
})();
