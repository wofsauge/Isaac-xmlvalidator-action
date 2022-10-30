import os
import glob
from lxml import etree


fileIgnoreList = ["seedmenu.xml", "fxlayers.xml"]

def clearIsaacRefsRecursive(node):
    for child in node.getchildren():
        if child.get("type") is not None:
            child.set("type",child.get("type").replace("xsisaac:",""))
        clearIsaacRefsRecursive(child)

def main():
    rootFolder = "**"
    if "INPUT_ROOTFOLDER" in os.environ:
        rootFolder = os.environ["INPUT_ROOTFOLDER"]
        print("Root folder provided: ", rootFolder)
    else:
        print("No Root folder provided. Using whole repository.")

    totalErrorCount = 0
    files = glob.glob(rootFolder + "/**.xml")
    for filename in files:
        filteredFilename = filename.split("\\")[len(filename.split("\\")) - 1]
        if filteredFilename in fileIgnoreList:
            continue

        print("Now analysing: " + filename)

        errCount = 0
        try:
            xmlschema_root_doc = etree.parse("Isaac-XML-Validator/isaacTypes.xsd")
            xmlschema_doc = etree.parse("Isaac-XML-Validator/xsd/" + filteredFilename.replace(".xml", ".xsd"))

            #Replace import node with content of the imported file, because lxml doesnt like https links 
            node = xmlschema_doc.getroot().find("{http://www.w3.org/2001/XMLSchema}import")
            if node is not None:
                for child in xmlschema_root_doc.getroot().getchildren():
                    xmlschema_doc.getroot().insert(0,child)
                xmlschema_doc.getroot().remove(node)
            clearIsaacRefsRecursive(xmlschema_doc.getroot())
            xmlschema = etree.XMLSchema(xmlschema_doc)

            xml_doc = etree.parse(filename)
            isValid = xmlschema.validate(xml_doc)
            if not isValid:
                for error in xmlschema.error_log:
                    print(error.filename+":line "+str(error.line)+":col "+str(error.column)+": "+error.message)
            else:
                print("File is valid")
        except Exception as err:
            print(err)
            errCount += 1
            print("SYNTAX ERROR DETECTED!!")

        if errCount > 0:
            print("---- End errors for file: " + filename)

        totalErrorCount += errCount
    print("~~~~~ Finished analysing " + str(len(files)) + " files! ~~~~~")
    print("Found: " + str(totalErrorCount) + " Errors")


if __name__ == "__main__":
    main()
