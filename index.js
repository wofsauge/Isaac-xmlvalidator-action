const core = require("@actions/core");
const glob = require("@actions/glob");
const xmllint = require("xmllint");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var fileIgnoreList = ["seedmenu.xml", "fxlayers.xml"];

var schemaData = 0,
  schemaFileName,
  refXML;

async function handleFiles() {
  var rootFolder = core.getInput("root-folder");
  if (!rootFolder) {
    console.log(`No Root folder provided. Using whole repository.`);
    rootFolder = "**";
  } else {
    console.log(`Root folder provided: ${rootFolder}!`);
  }
  rootFolder = "vanillaFiles";
  const globber = await glob.create(rootFolder + "/**.xml");
  const files = await globber.glob();
  console.log(`Found ` + files.length + ` files inside root folder: ${rootFolder}`);

  refXML = await JSDOM.fromURL("https://wofsauge.github.io/Isaac-XML-Validator/isaacTypes.xsd");
  for (const file of files) {
    var filename = file.replace(/^.*[\\\/]/, "");
    if (fileIgnoreList.indexOf(filename) === -1) {
      var xmlFileContent;
      try {
        var dom = await JSDOM.fromFile(file);
        xmlFileContent = dom.serialize();
        await loadXSDFile(filename, xmlFileContent, file);
      } catch (error) {
        console.log(file);
        console.log(error);
      }
    }
  }
}

async function loadXSDFile(fileName, xmlFileContent, file) {
  if (!fileName.trim()) {
    return; // is empty
  }
  fileName = fileName.toLowerCase();
  fileName = fileName.replace(".xml", ".xsd");
  var dom = await JSDOM.fromURL("https://wofsauge.github.io/Isaac-XML-Validator/xsd/" + fileName);
  var xmlFile = dom.window.document;
  const refXMLCopy = JSDOM.fragment(refXML.serialize());
  // Workaround for HTTPS imports not working with this xsd validator library
  // manually import the file content

  if (xmlFile.firstChild.attributes && xmlFile.firstChild.attributes["xmlns:xsisaac"]) xmlFile.firstChild.attributes.removeNamedItem("xmlns:xsisaac");

  for (let c of xmlFile.firstChild.childNodes) {
    if (c.nodeName == "xs:import") {
      for (let importNode of refXMLCopy.firstChild.childNodes) {
        if (importNode.nodeName != "#text") {
          c.parentNode.insertBefore(importNode, c);
        }
      }
      c.parentNode.removeChild(c);
      break;
    }
  }

  schemaData = dom.serialize();
  schemaData = schemaData.replaceAll("xsisaac:", ""); // replace schema identifier, which no longer is needed due to manual import
  schemaData = schemaData.replaceAll("simpletype", "simpleType"); // fix dom.serialize turning the attribute into lowercase...
  schemaFileName = fileName;

  var Module = {
    xml: xmlFileContent,
    schema: schemaData,
    arguments: ["--noout", "--schema", schemaFileName, schemaFileName.replace(".xsd", ".xml")],
  };
  console.log("Now analyzing:" + file);
  try {
    var result = xmllint.validateXML(Module);
  } catch (error) {
    console.error(error);
  }

  if (result.errors !== null) {
    result.errors.forEach((element) => {
      console.error(element);
    });
  } else {
    console.log("Success");
  }
}

(async () => {
  try {
    await handleFiles();
  } catch (error) {
    core.setFailed(error.message);
  }
})();
