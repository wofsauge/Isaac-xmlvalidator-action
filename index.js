const core = require('@actions/core');
const glob = require('@actions/glob');

try {
  const rootFolder = core.getInput('root-folder');
  if (!rootFolder) {
    console.log(`No Root folder provided. Using whole repository.`);
    rootFolder = "**"
  }else{
    console.log(`Root folder provided: ${rootFolder}!`);
  }
  
  const globber = glob.create(rootFolder+'/.xml')
  for await (const file of globber.globGenerator()) {
    console.log(file)
  }

} catch (error) {
  core.setFailed(error.message);
}
