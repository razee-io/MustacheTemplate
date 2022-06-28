const {promises: fs} = require('fs');
const yaml = require('js-yaml');

async function kubeDataFromYamlFiles(...filePaths) {
  let kubeData = {};
  for (const filePath of filePaths) {
    let data = await readYamlFile(filePath);
    for (const element of data) {
      const kind = element.kind;
      if (!(kind in kubeData)) {
        kubeData[kind] = [];
      }
      kubeData[kind].push(element);
      if (element.metadata.namespace === undefined) {
        const msg = `assuming "default" namespace missing from ${element.kind}/${element.metadata.name} in ${filePath}`;
        console.warn(msg);
        element.metadata.namespace = 'default';
      }
    }
  }
  return kubeData;
}

async function objToYaml(asObj) {
  return await yaml.dump(asObj);
}

async function printYaml(asObj) {
  process.stdout.write(await objToYaml(asObj));
}

async function readFile(filePath) {
  return await fs.readFile(filePath);
}

async function readYamlFile(filePath) {
  return await yamlToObj(await readFile(filePath));
}

async function writeFile(contents, filePath) {
  await fs.writeFile(filePath, contents);
}

async function writeYamlFile(asObj, filePath) {
  await writeFile(await objToYaml(asObj), filePath);
}

async function yamlToObj(asYaml) {
  return await yaml.loadAll(asYaml);
}

module.exports = {
  kubeDataFromYamlFiles,
  printYaml,
  readYamlFile,
  writeYamlFile
};
