import fs from 'fs';
import path from 'path';

const distDir = path.resolve("dist/assets");
const targetDir = path.resolve("../app/scripts");
const alSrcDir = path.resolve("../app/ControlAddIns");

if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

for (const file of fs.readdirSync(targetDir)) {
    if (file.endsWith(".js") || file.endsWith(".css")) {
        fs.unlinkSync(path.join(targetDir, file));
    }
}

const copiedFiles = [];
for (const file of fs.readdirSync(distDir)) {
    if (file.endsWith(".js") || file.endsWith(".css")) {
        fs.copyFileSync(path.join(distDir, file), path.join(targetDir, file));
        copiedFiles.push(file);
    }
}

const alFiles = fs.readdirSync(alSrcDir).filter(f => f.toLowerCase().includes("controladdin") && f.endsWith(".al"));

if (alFiles.length === 0) {
  console.error("❌ No ControlAddIn .al file found in app/src/. Make sure the file name includes 'ControlAddIn'.");
  process.exit(1);
}

const alFilePath = path.join(alSrcDir, alFiles[0]);
console.log(`📄 Found ControlAddIn file: ${alFilePath}`);

// 🧠 Step 4: Update Scripts and Styles in AL file
let alContent = fs.readFileSync(alFilePath, "utf8");

// Replace or insert script/style definitions
function replaceLine(sectionName, files) {
  const regex = new RegExp(`${sectionName}\\s*=\\s*(?:\\[[^\\]]*\\]|'[^']*');?`, "i");
  const replacement =
    files.length === 1
      ? `${sectionName} = 'scripts/${files[0]}';`
      : `${sectionName} = [${files.map(f => `"scripts/${f}"`).join(", ")}];`;

  if (regex.test(alContent)) {
    alContent = alContent.replace(regex, replacement);
  } else {
    // Insert before closing brace if not found
    alContent = alContent.replace(/\}\s*$/, `    ${replacement}\n}`);
  }
}

replaceLine("Scripts", copiedFiles.filter(f => f.endsWith(".js")));
replaceLine("StyleSheets", copiedFiles.filter(f => f.endsWith(".css")));

fs.writeFileSync(alFilePath, alContent, "utf-8");


console.log("✅ Copied new build files and updated AL ControlAddIn.");