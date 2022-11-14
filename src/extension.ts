import * as fs from 'fs';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vstemplate" is now active!');

	context.subscriptions.push(
		vscode.workspace.onDidCreateFiles(onDidCreateFiles)
	)

	const mapping = vscode.workspace.getConfiguration("vstemplate").get("snippets");

	console.log(mapping);
}

function onDidCreateFiles(event: vscode.FileCreateEvent) {
	for (const file of event.files) {

		if (fs.lstatSync(file.path).isDirectory()) {
			console.log("directory")
		}

		if (fs.lstatSync(file.path).isFile()) {
			console.log("file")
		}
	}
}

export function deactivate() {}
