# VSTemplate

VSTemplate let you create files and automatically fill them with some custom templates.

## Features

- Fill files with default boilerplate
- Create custom files according to the template

![demo](images/demo.gif)

## Variables

Here are some variables to use in configuration

| VARIABLE | Description                                                             |
| -------- | ----------------------------------------------------------------------- |
| FILENAME | The name of the initial file created (detected by the pattern wildcard) |

## Configuration

To configure your templates and file you have to edit the vscode configuration file

### vstemplate.templates

Example Structure

```json
{
    "React TS Component": [
        "import React from 'react';",
        "",
        "interface ${FILENAME}Props {",
        "};",
        "",
        "const ${FILENAME} = ({}: ${FILENAME}Props) => {",
        "    return <div>",
        "    </div>;",
        "};",
        "",
        "export default ${FILENAME};"
    ]
}
```

### vstemplate.snippets

Example Structure

```json
[
    {
        "pattern": "**/Components/*.tsx",
        "template": "React TS Component",
        "childs": [
            {
                "name": "${FILENAME}.stories.tsx",
                "template": "Some template..."
            }
        ]
    }
]
```

### Credits

The idea came after seeing a PHPStorm feature...