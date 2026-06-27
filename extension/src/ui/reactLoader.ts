import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function getReactHtml(
    webview: vscode.Webview,
    extensionUri: vscode.Uri
): string {

    const dist = vscode.Uri.joinPath(
        extensionUri,
        "..",
        "webview",
        "dist"
    );

    const indexPath = path.join(dist.fsPath, "index.html");

    let html = fs.readFileSync(indexPath, "utf8");

    html = html.replace(
        /href="(.*?)"/g,
        (_, asset) => {

            const uri = webview.asWebviewUri(
                vscode.Uri.joinPath(dist, asset)
            );

            return `href="${uri}"`;

        }
    );

    html = html.replace(
        /src="(.*?)"/g,
        (_, asset) => {

            const uri = webview.asWebviewUri(
                vscode.Uri.joinPath(dist, asset)
            );

            return `src="${uri}"`;

        }
    );

    return html;
}