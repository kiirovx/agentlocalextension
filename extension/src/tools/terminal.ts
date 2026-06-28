import * as vscode from "vscode";

export async function terminal(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const terminal = vscode.window.createTerminal("QwenForge");
      terminal.show();
      terminal.sendText(command);

      // Karena kita tidak bisa capture output terminal dengan mudah,
      // kita hanya konfirmasi command sudah dijalankan
      setTimeout(() => {
        resolve(`⚡ Command dikirim ke terminal: ${command}\n\n(Cek terminal untuk melihat output)`);
      }, 500);
    } catch (error: any) {
      reject(new Error(`Gagal menjalankan command: ${error.message}`));
    }
  });
}