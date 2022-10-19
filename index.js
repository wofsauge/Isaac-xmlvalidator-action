const core = require("@actions/core");
const glob = require("@actions/glob");
const xmllint = require("xmllint");
const {JSDOM} = require("jsdom");

const fileIgnoreList = ["seedmenu.xml", "fxlayers.xml"];

let schemaData = 0,
    schemaFileName,
    refXML;

async function handleFiles() {
    let rootFolder = core.getInput("root-folder");

    if (!rootFolder) {
        console.log(`No Root folder provided. Using whole repository.`);
        rootFolder = "**";
    } else {
        console.log(`Root folder provided: ${rootFolder}!`);
    }
    rootFolder = "vanillaFiles";

    const globber = await glob.create(rootFolder + "/**.xml");
    const files = await globber.glob();

    console.log(`Found ${files.length} files inside root folder: ${rootFolder}`);

    refXML = await JSDOM.fromFile("./Isaac-XML-Validator/isaacTypes.xsd", {
        contentType: "application/xml"
    });

    for (const file of files) {
        const filename = file.replace(/^.*[\\\/]/, "");

        if (fileIgnoreList.includes(filename)) {
            continue;
        }

        try {
            const dom = await JSDOM.fromFile(file);
            let xmlFileContent = dom.serialize();

            await loadXSDFile(filename, xmlFileContent, file);
        } catch (error) {
            console.log(file);
            console.log(error);
        }
    }
}

async function loadXSDFile(fileName, xmlFileContent, file) {
    const normalizedFilename = fileName.trim().toLowerCase().replace(".xml", ".xsd");

    if (normalizedFilename.length === 0) {
        return;
    }

    const dom = await JSDOM.fromFile("./Isaac-XML-Validator/xsd/" + normalizedFilename, {
        contentType: "application/xml"
    });
    const xmlFile = dom.window.document;
    const refXMLCopy = JSDOM.fragment(refXML.serialize());
    // Workaround for HTTPS imports not working with this xsd validator library
    // manually import the file content

    if (xmlFile.firstChild.attributes && xmlFile.firstChild.attributes["xmlns:xsisaac"]) {
        xmlFile.firstChild.attributes.removeNamedItem("xmlns:xsisaac");
    }

    for (let c of xmlFile.firstChild.childNodes) {
        if (c.nodeName !== "xs:import") {
            continue;
        }

        for (let importNode of refXMLCopy.firstChild.childNodes) {
            if (importNode.nodeName === "#text") {
                continue;
            }

            c.parentNode.insertBefore(importNode, c);
        }

        c.parentNode.removeChild(c);

        break;
    }

    schemaData = dom.serialize();
    schemaData = schemaData.replaceAll("xsisaac:", ""); // replace schema identifier, which no longer is needed due to manual import
    schemaData = schemaData.replaceAll("simpletype", "simpleType"); // fix dom.serialize turning the attribute into lowercase...
    schemaFileName = normalizedFilename;

    const Module = {
        xml: xmlFileContent,
        schema: schemaData,
        arguments: ["--noout", "--schema", schemaFileName, schemaFileName.replace(".xsd", ".xml")],
    };

    let result;

    console.log("Now analyzing:" + normalizedFilename);

    try {
        result = xmllint.validateXML(Module);
    } catch (error) {
        console.error(error);
    }

    if (result.errors === null) {
        console.log("Successfully validate file:", normalizedFilename);
        return;
    }

    result.errors.forEach((element) => {
        console.log(element);
    });
}

handleFiles().then(() => {
    console.log("Processed all files")
}).catch(error => core.setFailed(error.message));
