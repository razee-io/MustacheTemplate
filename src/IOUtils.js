const fs = require('fs');
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
  return await fs.promises.readFile(filePath);
}

async function readYamlFile(filePath) {
  return await yamlToObj(await readFile(filePath));
}

async function writeFile(contents, filePath) {
  fs.writeFile(filePath, contents, (err) => { console.error(err); });
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
