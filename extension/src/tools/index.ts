import { listFiles } from "./listFiles";
import { readFile } from "./readFile";
import { searchFiles } from "./searchFiles";
import { writeFile } from "./writeFile";
import { createFile } from "./createFile";
import { deleteFile } from "./deleteFile";
import { exists } from "./exists";
import { mkdir } from "./mkdir";
import { renameFile } from "./renameFile";
import { moveFile } from "./moveFile";
import { grep } from "./grep";
import { glob } from "./glob";
import { runTerminalCommand } from "./terminal";
import { getWorkspaceContext } from "./workspace";


export const tools = {
    getWorkspaceContext,
    listFiles,
    readFile,
    searchFiles,
    writeFile,
    createFile,
    deleteFile,
    exists,
    mkdir,
    renameFile,
    moveFile,
    grep,
    glob,
    runTerminalCommand,
};

export type ToolName = keyof typeof tools;

export interface ToolDefinition {
    name: ToolName;
    description: string;
    parameters: string[];
}

export const toolDefinitions: ToolDefinition[] = [
    { name: "listFiles", description: "List all files in the workspace", parameters: [] },
    { name: "getWorkspaceContext", description: "Get workspace info: frameworks, config files, project type", parameters: [] },
    { name: "readFile", description: "Read the content of a file", parameters: ["path"] },
    { name: "searchFiles", description: "Search files by name or keyword", parameters: ["keyword"] },
    { name: "writeFile", description: "Write content to a file (overwrites if exists)", parameters: ["path", "content"] },
    { name: "createFile", description: "Create a new file (fails if exists)", parameters: ["path", "content?"] },
    { name: "deleteFile", description: "Delete a file", parameters: ["path"] },
    { name: "exists", description: "Check if a path exists", parameters: ["path"] },
    { name: "mkdir", description: "Create a new directory", parameters: ["path"] },
    { name: "renameFile", description: "Rename a file or directory", parameters: ["oldPath", "newPath"] },
    { name: "moveFile", description: "Move a file to a new location", parameters: ["sourcePath", "destPath"] },
    { name: "grep", description: "Search file contents using regex", parameters: ["pattern"] },
    { name: "glob", description: "Find files matching a glob pattern", parameters: ["pattern"] },
    { name: "runTerminalCommand", description: "Execute a terminal command", parameters: ["command"] },
];