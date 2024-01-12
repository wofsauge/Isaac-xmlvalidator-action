# Isaac XML File validator

Checks the validity of all .xml files inside your Binding of Isaac mod files for both syntax and usage errors.

This validator uses the XSD validation files provided by this github project as a reference: [https://github.com/wofsauge/isaac-xml-validator](https://github.com/wofsauge/isaac-xml-validator)

## Demo
You can see a demo usage of this action here: [https://github.com/wofsauge/xml-validator-testMod](https://github.com/wofsauge/xml-validator-testMod)

Or look into the provided testcase workflow file: [action-test.yml](https://github.com/wofsauge/Isaac-xmlvalidator-action/blob/main/.github/workflows/action-test.yml)

## Inputs

### `rootFolder`

**Required** Folder where the tool should search for .xml files. *Default* `"**"`.
### `recursive`

Should .xml files be searched recursively in the directory. *Default* `true`.
### `expectedErrorCount`

Number of validation errors that are expected to occur. good for debugging. *Default* `0`.

### `ignore`

Ignore specific files or folders. Seperate multiple entries by comma. The Tool will already automatically ignore the folders: node_modules, content/rooms and resources/rooms. It also ignores the files "fxlayers.xml" and "seedmenu.xml", as well as most entries provided by a .gitignore file inside the given root folder

### `ignoreWarnings`

If set to true, this will cause warnings, such as unrecognized attributes, to not count towards the total error count.

## Example usages

This example will recursively check every xml file all folders of your mod:
```yaml
uses: wofsauge/Isaac-xmlvalidator-action@main
```
----
This example will recursively check every xml file within the `content` folder of your mod:
```yaml
uses: wofsauge/Isaac-xmlvalidator-action@main
with:
  rootFolder: 'content'
```
----
This example will check every xml file within the `resources` folder of your mod, and will expect 4 errors to be thrown. It will also ignore some test files:
```yaml
uses: wofsauge/Isaac-xmlvalidator-action@main
with:
  rootFolder: 'resources'
  recursive: false
  expectedErrorCount: 4
  ignore: test.xml,test2.xml,testFolder/
```
