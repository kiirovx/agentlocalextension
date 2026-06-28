import { readFile } from "./readFile";
import { writeFile } from "./writeFile";
import { createFile } from "./createFile";
import { deleteFile } from "./deleteFile";
import { listFiles } from "./listFiles";
import { searchFiles } from "./searchFiles";
import { grep } from "./grep";
import { terminal } from "./terminal";
import { mkdir } from "./mkdir";
import { exists } from "./exists";
import { moveFile } from "./moveFile";
import { renameFile } from "./renameFile";

export const tools: Record<string, (...args: any[]) => Promise<any>> = {
  read_file: readFile,
  write_file: writeFile,
  create_file: createFile,
  delete_file: deleteFile,
  list_files: listFiles,
  search_files: searchFiles,
  grep: grep,
  terminal: terminal,
  mkdir: mkdir,
  exists: exists,
  move_file: moveFile,
  rename_file: renameFile,
};