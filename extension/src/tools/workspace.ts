import * as vscode from "vscode";
import * as fs from "fs";

export interface WorkspaceContext {
  projectType?: string;
  frameworks: string[];
  configFiles: string[];
  hasPackageJson: boolean;
  hasTsConfig: boolean;
  hasComposerJson: boolean;
  hasCargoToml: boolean;
  hasRequirementsTxt: boolean;
  hasPomXml: boolean;
  hasBuildGradle: boolean;
  hasPubspecYaml: boolean;
}

export async function getWorkspaceContext(): Promise<WorkspaceContext> {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const rootPath = workspace.uri.fsPath;
  const frameworks: string[] = [];
  const configFiles: string[] = [];

  const checkFile = (relativePath: string): boolean => {
    const fullPath = fs.existsSync(
      vscode.Uri.joinPath(workspace.uri, relativePath).fsPath
    );
    if (fullPath) { configFiles.push(relativePath); }
    return fullPath;
  };

  const hasPackageJson = checkFile("package.json");
  const hasTsConfig = checkFile("tsconfig.json");
  const hasComposerJson = checkFile("composer.json");
  const hasCargoToml = checkFile("Cargo.toml");
  const hasRequirementsTxt = checkFile("requirements.txt");
  const hasPomXml = checkFile("pom.xml");
  const hasBuildGradle = checkFile("build.gradle") || checkFile("build.gradle.kts");
  const hasPubspecYaml = checkFile("pubspec.yaml");

  // Detect frameworks
  if (hasPackageJson) {
    try {
      const pkg = JSON.parse(
        fs.readFileSync(
          vscode.Uri.joinPath(workspace.uri, "package.json").fsPath,
          "utf8"
        )
      );
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps.next || deps.react) { frameworks.push("React"); }
      if (deps.next) { frameworks.push("Next.js"); }
      if (deps.vue) { frameworks.push("Vue"); }
      if (deps["@angular/core"]) { frameworks.push("Angular"); }
      if (deps.svelte) { frameworks.push("Svelte"); }
      if (deps.express) { frameworks.push("Express"); }
      if (deps.fastify) { frameworks.push("Fastify"); }
      if (deps.nestjs) { frameworks.push("NestJS"); }
      if (deps.tailwindcss) { frameworks.push("TailwindCSS"); }
    } catch {}
  }

  if (hasComposerJson) { frameworks.push("PHP/Composer"); }
  if (hasCargoToml) { frameworks.push("Rust/Cargo"); }
  if (hasRequirementsTxt) { frameworks.push("Python"); }
  if (hasPomXml || hasBuildGradle) { frameworks.push("Java/JVM"); }
  if (hasPubspecYaml) { frameworks.push("Dart/Flutter"); }

  let projectType: string | undefined;
  if (frameworks.length > 0) {
    projectType = frameworks[0];
  } else if (hasTsConfig) {
    projectType = "TypeScript";
  } else if (hasPackageJson) {
    projectType = "Node.js";
  }

  return {
    projectType,
    frameworks,
    configFiles,
    hasPackageJson,
    hasTsConfig,
    hasComposerJson,
    hasCargoToml,
    hasRequirementsTxt,
    hasPomXml,
    hasBuildGradle,
    hasPubspecYaml,
  };
}
