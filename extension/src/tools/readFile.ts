import * as vscode from "vscode";
import * as path from "path";

export async function readFile(filePath: string): Promise<string> {
  console.log(`📖 readFile called with: "${filePath}"`);

  if (!filePath || filePath.trim() === "") {
    throw new Error("Parameter path tidak boleh kosong");
  }

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error("Tidak ada workspace yang terbuka. Buka folder dulu!");
  }

  const rootPath = workspaceFolders[0].uri.fsPath;
  const fullPath = path.resolve(rootPath, filePath);

  console.log(`📖 Full path: ${fullPath}`);

  try {
    const uri = vscode.Uri.file(fullPath);
    const document = await vscode.workspace.openTextDocument(uri);
    const content = document.getText();
    const lineCount = document.lineCount;

    return `📄 File: ${filePath}\n📏 ${lineCount} baris\n\n${content}`;
  } catch (error: any) {
    console.error(`❌ readFile error:`, error);
    throw new Error(`Gagal membaca file "${filePath}": ${error.message}`);
  }
}