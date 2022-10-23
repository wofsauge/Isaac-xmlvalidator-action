import os
import glob
from xsd_validator import XsdValidator


fileIgnoreList = ["seedmenu.xml", "fxlayers.xml"]
errorIgnoreList = [
    "cvc-pattern-valid: Value '' is not facet-valid",
    "The value '' of attribute",
]


def main():
    rootFolder = "**"
    if "INPUT_ROOTFOLDER" in os.environ:
        rootFolder = os.environ["INPUT_ROOTFOLDER"]
        print("Root folder provided: ", rootFolder)
    else:
        print("No Root folder provided. Using whole repository.")

    totalErrorCount = 0
    files = glob.glob(rootFolder + "/**.xml")
    for file in files:
        filteredFilename = file.split("\\")[len(file.split("\\")) - 1]
        if filteredFilename in fileIgnoreList:
            continue

        print("Now analysing: " + file)

        errCount = 0
        try:
            validator = XsdValidator(
                "Isaac-XML-Validator/xsd/" + filteredFilename.replace(".xml", ".xsd")
            )
            errors = validator(file)

            for err in errors:
                res = [ele for ele in errorIgnoreList if(ele in str(err))]
                if not res:
                    errCount += 1
                    print(err)

        except Exception as err:
            errCount += 1
            print(err)
            print("SYNTAX ERROR DETECTED!!")
            #do nothing

        if errCount > 0:
            print("---- End errors for file: " + file)
            
        totalErrorCount += errCount
    print("~~~~~ Finished analysing " + str(len(files)) + " files! ~~~~~")
    print("Found: " + str(totalErrorCount) + " Errors")


if __name__ == "__main__":
    main()
