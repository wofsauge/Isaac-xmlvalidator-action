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
This example will check every xml file within the `resources` folder of your mod, and will expect 4 errors to be thrown:
```yaml
uses: wofsauge/Isaac-xmlvalidator-action@main
with:
  rootFolder: 'resources'
  recursive: false
  expectedErrorCount: 4
```
