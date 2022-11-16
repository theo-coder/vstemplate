import * as fs from "fs";
import * as vscode from "vscode";
import * as path from "path";
import * as micromatch from "micromatch";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vstemplate" is now active!');

  context.subscriptions.push(
    vscode.workspace.onDidCreateFiles(onDidCreateFiles)
  );
}

function onDidCreateFiles(event: vscode.FileCreateEvent) {
  const SNIPPETS: Snippet[] | undefined = vscode.workspace
    .getConfiguration("vstemplate")
    .get("snippets");

  const TEMPLATES: Template | undefined = vscode.workspace
    .getConfiguration("vstemplate")
    .get("templates");

  if (!SNIPPETS) return;
  if (!TEMPLATES) return;

  for (const file of event.files) {
    if (fs.lstatSync(file.path).isFile()) {
      const snippet = SNIPPETS.find((snippet) =>
        micromatch.isMatch(file.path, snippet.pattern)
      );
      if (!snippet) return;

      const template = TEMPLATES[snippet.template];
      if (!template) return;

      fillFileWithTemplate(file.path, template);

      if (!snippet.childs) return;

      for (const child of snippet.childs) {
        const template = TEMPLATES[child.template];
        if (!template) return;

        let filename = child.name;
        const patterns = filename.match(/\$\{([^}]+)\}/g);

        if (patterns) {
          for (const pattern of patterns) {
            let replaceString = pattern;

            switch (pattern) {
              case "${FILENAME}": {
                replaceString = path.parse(file.path).name.match(/^[^.]*/)![0];
                break;
              }
            }

            filename = filename.replaceAll(pattern, replaceString);
          }
        }

        fillFileWithTemplate(
          `${path.parse(file.path).dir}/${filename}`,
          template
        );
      }
    }
  }
}

function fillFileWithTemplate(filepath: string, template: string | string[]) {
  const writeStream = fs.createWriteStream(filepath);

  if (Array.isArray(template)) {
    for (let line of template) {
      const patterns = line.match(/\$\{([^}]+)\}/g);

      if (patterns) {
        for (const pattern of patterns) {
          let replaceString = pattern;

          switch (pattern) {
            case "${FILENAME}": {
              replaceString = path.parse(filepath).name.match(/^[^.]*/)![0];
              break;
            }
          }

          line = line.replaceAll(pattern, replaceString);
        }
      }
      writeStream.write(`${line}\n`);
    }
  } else {
    writeStream.write(`${template}\n`);
  }

  writeStream.end();
}

export function deactivate() {}

type Snippet = {
  pattern: string;
  template: string;
  childs?: {
    name: string;
    template: string;
  }[];
};

type Template = Record<string, string[] | string>;
