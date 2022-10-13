const core = require('@actions/core');
const glob = require('@actions/glob');

async function handleFiles() {
  const globber = await glob.create(rootFolder+'/.xml')
  for await (const file of globber.globGenerator()) {
    console.log(file);
  }
}

try {
  const rootFolder = core.getInput('root-folder');
  if (!rootFolder) {
    console.log(`No Root folder provided. Using whole repository.`);
    rootFolder = "**"
  }else{
    console.log(`Root folder provided: ${rootFolder}!`);
  }

  handleFiles();

} catch (error) {
  core.setFailed(error.message);
}
