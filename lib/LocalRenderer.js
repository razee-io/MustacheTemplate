const IOUtils = require('./IOUtils');
const LocalMustacheTemplateController = require('./LocalMustacheTemplateController');

const { FetchEnvs, MockController } = require('@razee/razeedeploy-core');

module.exports = class LocalRenderer {
  constructor(mtpPath, ...envPaths) {
    this.mtpPath = mtpPath;
    this.envPaths = envPaths;
  }

  async render() {
    const mtp = await IOUtils.readYamlFile(this.mtpPath);
    const kubeData = await IOUtils.kubeDataFromYamlFiles(...this.envPaths);

    const eventData = {
      type: 'ADDED',
      object: mtp[0]
    }

    const fetchEnvs = new FetchEnvs(new MockController(eventData, kubeData));
    const view = await fetchEnvs.get('spec');

    const mtpController = new LocalMustacheTemplateController({eventData: eventData, kubeData: kubeData});
    let templates = mtpController.concatTemplates();
    templates = await mtpController.processTemplate(templates, view);

    if (templates.length > 1) {
      throw Error("can only handle one template!");
    }

    return templates[0];
  }
}
