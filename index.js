const core = require('@actions/core');
const glob = require('@actions/glob');
const xmllint = require('xmllint.js');

async function handleFiles() {
  const rootFolder = core.getInput('root-folder');
  if (!rootFolder) {
    console.log(`No Root folder provided. Using whole repository.`);
    rootFolder = "**"
  }else{
    console.log(`Root folder provided: ${rootFolder}!`);
  }

  const globber = await glob.create(rootFolder+'/.xml')
  const files = await globber.glob();
  console.log(`Found `+files.length+` files inside root folder: ${rootFolder}`);

  files.forEach(file => {
    console.log(file);
  });
}

try {
  handleFiles();

} catch (error) {
  core.setFailed(error.message);
}
