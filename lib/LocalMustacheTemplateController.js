const { MockKubeResourceMeta } = require('@razee/razeedeploy-core');
const MustacheTemplateController = require('../src/MustacheTemplateController');

module.exports = class LocalMustacheTemplateController extends MustacheTemplateController {
  constructor(params) {
    let kubeData = {};
    if (params.kubeData !== undefined) {
      kubeData = params.kubeData;
      delete params.kubeData;
    }
    params.kubeResourceMeta = new MockKubeResourceMeta(
      'deploy.razee.io/v1alpha2', 'MustacheTemplate', kubeData
    );
    params.logger = {
      info: () => {}
    };
    super(params);
  }
};
