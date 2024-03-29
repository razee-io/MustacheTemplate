/**
 * Copyright 2019 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { EventHandler, KubeClass } = require('@razee/kubernetes-util');
const { ReferencedResourceManager, RRMEventHandler } = require('@razee/razeedeploy-core');
const ParentResourceKinds = ['MustacheTemplate'];

const ControllerString = 'MustacheTemplate';
const Controller = require(`./${ControllerString}Controller`);
const log = require('./logger').createLogger(ControllerString);
const log1 = require('./logger').createLogger('ReferencedResourceManager');
const WATCH_RESOURCE_REFERENCES = process.env.WATCH_RESOURCE_REFERENCES != undefined ? process.env.WATCH_RESOURCE_REFERENCES : 'true';

async function createNewEventHandler(kc) {
  let result;
  const resourceMeta = await kc.getKubeResourceMeta('deploy.razee.io/v1alpha2', ControllerString, 'watch');
  if (resourceMeta) {
    const params = {
      kubeResourceMeta: resourceMeta,
      factory: Controller,
      kubeClass: kc,
      logger: log,
      requestOptions: { qs: { timeoutSeconds: process.env.CRD_WATCH_TIMEOUT_SECONDS || 300 } },
      livenessInterval: true,
      options: {
        reconcileByDefault: process.env.MTP_RECONCILE_BY_DEFAULT || true
      }
    };
    result = new EventHandler(params);
  } else {
    log.error(`Unable to find KubeResourceMeta for deploy.razee.io/v1alpha2: ${ControllerString}`);
  }
  return result;
}

async function createParentRRMEventHandler(kc, parentResourceKind) {
  let result;
  const resourceMeta = await kc.getKubeResourceMeta('deploy.razee.io/v1alpha2', parentResourceKind, 'watch');
  if (resourceMeta) {
    const params = {
      kubeResourceMeta: resourceMeta,
      factory: ReferencedResourceManager,
      kubeClass: kc,
      logger: log1,
      requestOptions: { qs: { timeoutSeconds: process.env.CRD_WATCH_TIMEOUT_SECONDS || 300 } },
      livenessInterval: true,
      managedResourceType: 'parent'
    };
    result = new RRMEventHandler(params);
  } else {
    log.error(`Unable to find KubeResourceMeta for deploy.razee.io/v1alpha2: ${parentResourceKind}`);
  }
  return result;
}

async function main() {
  log.info(`Running ${ControllerString}Controller.`);
  const kc = new KubeClass();
  await createNewEventHandler(kc);
  if (WATCH_RESOURCE_REFERENCES === 'true') {
    for (const parentResourceKind of ParentResourceKinds) {
      await createParentRRMEventHandler(kc, parentResourceKind);
    }
  }
}


function createEventListeners() {
  process.on('SIGTERM', () => {
    log.info('recieved SIGTERM. not handling at this time.');
  });
  process.on('unhandledRejection', (reason) => {
    log.error('recieved unhandledRejection', reason);
  });
  process.on('beforeExit', (code) => {
    log.info(`No work found. exiting with code: ${code}`);
  });

}

async function run() {
  try {
    createEventListeners();
    await main();
  } catch (error) {
    log.error(error);
  }

}

module.exports = {
  run,
  LocalRenderer: require('../lib/LocalRenderer'),
  MustacheTemplateController: Controller
};
