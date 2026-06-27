import * as vscode from "vscode";

import { ChatProvider } from "./providers/ChatProvider";

export function activate(context:vscode.ExtensionContext){

    console.log("QwenForge Started");

    context.subscriptions.push(

        vscode.window.registerWebviewViewProvider(

            ChatProvider.viewType,

            new ChatProvider(context)

        )

    );

}

export function deactivate(){}