import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export async function writeFile(filePath: string, content: string): Promise<string> {
  console.log(`✏️ writeFile called: "${filePath}" (${content?.length || 0} chars)`);

  if (!filePath || filePath.trim() === "") {
    throw new Error("Parameter path tidak boleh kosong");
  }

  if (content === undefined || content === null) {
    throw new Error("Parameter content tidak boleh kosong");
  }

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error("Tidak ada workspace yang terbuka");
  }

  const rootPath = workspaceFolders[0].uri.fsPath;
  const fullPath = path.resolve(rootPath, filePath);

  console.log(`✏️ Full path: ${fullPath}`);

  try {
    // Pastikan folder parent ada
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✏️ Created directory: ${dir}`);
    }

    fs.writeFileSync(fullPath, content, "utf8");
    console.log(`✏️ File written successfully`);

    return `✅ File berhasil ditulis: ${filePath}\n📏 ${content.length} karakter\n📍 Lokasi: ${fullPath}`;
  } catch (error: any) {
    console.error(`❌ writeFile error:`, error);
    throw new Error(`Gagal menulis file "${filePath}": ${error.message}`);
  }
}