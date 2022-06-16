# MustacheTemplate

[![Build Status](https://travis-ci.com/razee-io/MustacheTemplate.svg?branch=master)](https://travis-ci.com/razee-io/MustacheTemplate)
![GitHub](https://img.shields.io/github/license/razee-io/MustacheTemplate.svg?color=success)

MustacheTemplate is the next step of complexity when working with Razee. With
MustacheTemplate we can inject cluster specific environment variables into
resources before applying them to a cluster. We even use this injection method
as the mechanism for version control of our resources.

The basic operation of MustacheTemplate is to collect all values defined in
`.spec.envFrom` and `.spec.env`, then use those values to process all yaml
defined in the `.spec.templates`, and finally apply the processed yaml to the cluster.

## Install

[Razee Deploy Delta](https://github.com/razee-io/razeedeploy-delta) is the
recommended way to install MustacheTemplate.

Optional: [Advanced Controller Options](#cluster-wide-controls)

**Warning:** By default, Razeedeploy runs as cluster wide admin. Any user that has
permission to create a razeedeploy resource (RemoteResource or MustacheTemplate)
has the ability to escalate their privileges. To prevent privilege escalation,
cluster owners should restrict which users are allowed to create razeedeploy
resources. Alternatively, you can setup [ImpersonationWebhook](https://github.com/razee-io/ImpersonationWebhook)
and then [enable user impersonation](#enable-cluster-wide-user-impersonation) to
ensure razeedeploy only allows users to do operations that they have already been
granted access to do.

## Resource Definition

### Sample

```yaml
apiVersion: deploy.razee.io/v1alpha2
kind: MustacheTemplate
metadata:
  name: <mustache_template_name>
  namespace: <namespace>
spec:
  clusterAuth:
    impersonateUser: razeedeploy
  envFrom:
    - genericMapRef:
        apiVersion: deploy.razee.io/v1alpha2
        kind: FeatureFlagSetLD
        name: myLDProject
        namespace: default
  env:
    - name: app-label
      value: "deployment 1"
    - name: desired-replicas
      optional: true
      default: 3
      valueFrom:
        configMapKeyRef:
          name: nginx-config
          key: replicas
          type: number
    - name: json-config
      valueFrom:
        configMapKeyRef:
          name: nginx-config-globals
          key: my-app-config
          type: json
    - name: json-config
      overrideStrategy: merge
      valueFrom:
        configMapKeyRef:
          name: nginx-config-dev
          key: my-app-config-dev-overrides
          type: json
    - name: json-merge-selectors
      overrideStrategy: merge
      valueFrom:
        configMapKeyRef:
          matchLabels:
            app: json-rules-merge
          key: json-config
          type: json
  templates:
    - apiVersion: v1
      kind: ConfigMap
      metadata:
        name: test-config
      data:
        sample: "{{ desired-replicas }}"
  strTemplates:
    - |
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: nginx-deployment
        labels:
          app: nginx
          deployment: {{ app-label }}
      spec:
        replicas: {{ desired-replicas }}
        selector:
          matchLabels:
            app: nginx
        template:
          metadata:
            labels:
              app: nginx
          spec:
            containers:
            - name: nginx
              image: nginx:1.7.9
              ports:
              - containerPort: 80
```

### Spec

**Path:** `.spec`

**Description:** `spec` is required and **must** include at least one [`envFrom`
, `env`] and at least one [`templates`, `strTemplates`].

**Schema:**

```yaml
spec:
  type: object
  allOf:
    - anyOf:
        - required: [templates]
        - required: [strTemplates]
    - anyOf:
        - required: [envFrom]
        - required: [env]
  properties:
    clusterAuth:
      type: object
      ...
    templateEngine:
      type: string
      ...
    custom-tags:
      type: array
      ...
    envFrom:
      type: array
      ...
    env:
      type: array
      ...
    templates:
      type: array
      ...
    strTemplates:
      type: array
      ...
```

### User Impersonation

**Path:** `.spec.clusterAuth.impersonateUser`

**Description:** [Impersonates](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#user-impersonation)
a user for the given resource. This includes all actions the controller must
make related to the resource (fetching envs, getting resources, applying
resources, etc.). ImpersonateUser only applies to the single RazeeDeploy
resource that it has been added to.

**Important:** [The impersonation webhook](https://github.com/razee-io/ImpersonationWebhook)
**must** be installed to perform permission validation. Only users with impersonation
permission can impersonate others. If the webhook is not installed, anyone can
impersonate others, and this will lead to privilege escalation.

**Schema:**

```yaml
properties:
  clusterAuth:
    type: object
    properties:
      impersonateUser:
        type: string
```

**Default:** `'razeedeploy'`

### Templating Engine

**Path:** `.spec.templateEngine`

**Description:** Specifying which templating engine to use, the available
options are `mustache` and `handlebars`

**Schema:**

```yaml
properties:
  templateEngine:
    type: string
    pattern: "^mustache$|^handlebars$"
```

**Default:** `'mustache'`

### Custom Tags

**Path:** `.spec.custom-tags`

**Description:** Specifying custom tags will override the default mustache tags.
This can be useful when you need to reserve `{{ }}` for some other processing.

**Schema:**

```yaml
custom-tags:
  type: array
  maxItems: 2
  minItems: 2
  items:
    type: string
    maxLength: 3
    minLength: 2
```

**Default:** `['{{', '}}']`

### EnvFrom

**Path:** `.spec.envFrom`

**Description:** Allows you to pull in all values from a resource's `.data` section
to be used in template processing. ie. ConfigMaps would use the `configMapRef` key
and CRDs with a high level `.data` section can be pulled in by using the
`genericMapRef` key. The keys pulled from the resource are what you would use
to match values into your templates.

**Note:** values are loaded in from `.spec.envFrom` before `.spec.env`, and
top down. Any values with the same key/name will be overwritten, last in wins.

**Schema:**

```yaml
envFrom:
  type: array
  items:
    type: object
    oneOf:
      - required: [configMapRef]
      - required: [secretMapRef]
      - required: [genericMapRef]
    properties:
      optional:
        type: boolean
      configMapRef:
        type: object
        required: [name]
        properties:
          name:
            type: string
          namespace:
            type: string
      secretMapRef:
        type: object
        required: [name]
        properties:
          name:
            type: string
          namespace:
            type: string
      genericMapRef:
        type: object
        required: [apiVersion, kind, name]
        properties:
          apiVersion:
            type: string
          kind:
            type: string
          name:
            type: string
          namespace:
            type: string
```

#### EnvFrom Optional

**Path:** `.spec.envFrom[].optional`

**Description:** If fetching env/envFrom resource fails, MustacheTemplate will stop
execution and report error to `.status`. You can allow execution to continue by
marking a reference as optional.

**Schema:**

```yaml
optional:
  type: boolean
```

**Default:** `false`

### Env

**Path:** `.spec.env`

**Description:** Allows you to pull in a single value from a resource's `.data`
section to be used in template processing. ie. ConfigMaps would use the
`configMapKeyRef` key and CRDs with a high level `.data` section can be pulled
from by using the `genericKeyRef` key. `.spec.env.name` is what you would use to
match values into your templates. You can also specify a `type` that we will
convert your fetched string into, before injecting into your template (one of
[number, boolean, json, jsonString, base64]). Note: when no type is specified,
the value will be treated as a normal string.

**Note:** values are loaded in from `.spec.envFrom` before `.spec.env`, and
top down. Any values with the same key/name will be overwritten, last in wins.
If you want to have json values merged, specify [`overrideStrategy: merge`](#Env-OverrideStrategy)

**Schema:**

```yaml
env:
  type: array
  items:
    type: object
    allOf:
      - required: [name]
      - # all array items should be oneOf ['value', 'valueFrom']
        oneOf:
          - required: [value]
            # if 'value', neither 'optional' nor 'default' may be used
            not:
              anyOf:
                - required: [default]
                - required: [optional]
          - required: [valueFrom]
            # if 'valueFrom', you must define oneOf:
            oneOf:
              - # neither 'optional' nor 'default' is used
                not:
                  anyOf:
                    - required: [default]
                    - required: [optional]
              - # 'optional' is used by itself
                required: [optional]
                not:
                  required: [default]
              - # 'optional' and 'default' are used together IFF optional == true
                required: [optional, default]
                properties:
                  optional:
                    enum: [true]
    properties:
      optional:
        type: boolean
      default:
        x-kubernetes-int-or-string: true
      name:
        type: string
      overrideStrategy:
        type: string
        pattern: "^merge$|^replace$"
      value:
        x-kubernetes-int-or-string: true
      valueFrom:
        type: object
        oneOf:
          - required: [configMapKeyRef]
          - required: [secretKeyRef]
          - required: [genericKeyRef]
        properties:
          configMapKeyRef:
            type: object
            oneOf:
              - required: [key, name]
              - required: [key, matchLabels]
            properties:
              name:
                type: string
              key:
                type: string
              namespace:
                type: string
              type:
                type: string
                enum: [number, boolean, json, jsonString, base64]
              matchLabels:
                type: object
                additionalProperties: true
          secretKeyRef:
            type: object
            oneOf:
              - required: [key, name]
              - required: [key, matchLabels]
            properties:
              name:
                type: string
              key:
                type: string
              namespace:
                type: string
              type:
                type: string
                enum: [number, boolean, json, jsonString, base64]
              matchLabels:
                type: object
                additionalProperties: true
          genericKeyRef:
            type: object
            oneOf:
              - required: [apiVersion, kind, name, key]
              - required: [apiVersion, kind, matchLabels, key]
            properties:
              apiVersion:
                type: string
              kind:
                type: string
              name:
                type: string
              key:
                type: string
              namespace:
                type: string
              type:
                type: string
                enum: [number, boolean, json, jsonString, base64]
              matchLabels:
                type: object
                additionalProperties: true
```

#### Env Optional

**Path:** `.spec.env[].optional`

**Description:** If fetching env/envFrom resource fails, MustacheTemplate will stop
execution and report error to `.status`. You can allow execution to continue by
marking a reference as `optional: true`.

**Schema:**

```yaml
optional:
  type: boolean
```

**Default:** `false`

#### Env Default

**Path:** `.spec.env[].default`

**Description:** If fetching env/envFrom resource fails, but `.spec.env[].optional`
is `true` and `.spec.env[].default` is defined, the default value will be used.

**Schema:**

```yaml
default:
  x-kubernetes-int-or-string: true
```

#### Env OverrideStrategy

**Path:** `.spec.env[].overrideStrategy`

**Description:** If you are loading envs as json, and you want to allow overrided
values to merge instead of just replacing, specify `overrideStrategy: merge`.

**Note:** If either env defined is not a json object when merge is specified, the
behavior will revert to replace instead of merge (ie. a json object is loaded first,
then a jsonString is loaded second with `overrideStrategy: merge` specified. the
jsonString will replace the first json object instead of trying to merge with it.)

**Schema:**

```yaml
overrideStrategy:
  type: string
  pattern: "^merge$|^replace$"
```

**Default:** `replace`

### Managed Resource Labels

#### Reconcile

`.spec.templates.metadata.labels[deploy.razee.io/Reconcile]`

- DEFAULT: `true`
  - A razeedeploy resource (parent) will clean up a resources it applies (child)
    when either the child is no longer in the parent resource definition or the
    parent is deleted.
- `false`
  - This behavior can be overridden when a child's resource definition has
    the label `deploy.razee.io/Reconcile=false`.

#### Resource Update Mode

`.spec.templates.metadata.labels[deploy.razee.io/mode]`

Razeedeploy resources default to merge patching children. This behavior can be
overridden when a child's resource definition has the label
`deploy.razee.io/mode=<mode>`

Mode options:

- DEFAULT: `Apply` (`MergePatch`)
  - A simple merge, that will merge objects and replace arrays. Items previously
    defined, then removed from the definition, will be removed from the live resource.
  - "As defined in [RFC7386](https://tools.ietf.org/html/rfc7386), a Merge Patch
    is essentially a partial representation of the resource. The submitted JSON is
    "merged" with the current resource to create a new one, then the new one is
    saved. For more details on how to use Merge Patch, see the RFC." [Reference](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#patch-operations)
- `StrategicMergePatch`
  - A more complicated merge, the kubernetes apiServer has defined keys to be
    able to intelligently merge arrays it knows about.
  - "Strategic Merge Patch is a custom implementation of Merge Patch. For a
    detailed explanation of how it works and why it needed to be introduced, see
    [StrategicMergePatch](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/strategic-merge-patch.md)."
    [Reference](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#patch-operations)
  - [Kubectl Apply Semantics](https://kubectl.docs.kubernetes.io/pages/app_management/field_merge_semantics.html)
- `AdditiveMergePatch`
  - Similar to the default `Apply` (`MergePatch`), this is a simple merge, that
    will merge objects and replace arrays. The difference is that it will
    not remove fields from the live resource when they are removed from the
    definition. eg. This will only add/update fields, it wont remove fields.
  - If you are using this mode and find that you need to remove a field, you can
    do so manually, by setting the field in the yaml defintion to have a value
    of `null`. When the null value is merged with the live resource, it will
    effectively delete the field.
  - This mode is useful if you have very large resources and require that the
    `last-applied-configuration` annotation is not injected into the resource.
- `EnsureExists`
  - Will ensure the resource is created and is replaced if deleted. Will not
    enforce a definition.

### Debug Individual Resource

`.spec.resources.metadata.labels[deploy.razee.io/debug]`

Treats the live resource as EnsureExist. If any Kapitan component is enforcing
the resource, and the label `deploy.razee.io/debug: true` exists on the live
resource, it will treat the resource as ensure exist and not override any changes.
This is useful for when you need to debug a live resource and don't want Kapitan
overriding your changes. Note: this will only work when you add it to live resources.
If you want to have the EnsureExist behavior, see [Resource Update Mode](#Resource-Update-Mode).

- ie: `kubectl label mtp <your-mtp> deploy.razee.io/debug=true`

## Cluster Wide Controls

The optional `razeedeploy-config` ConfigMap can be used to customize the
controller for cluster wide actions.

Because the ConfigMap is optional, if it is created the first time, you must
restart controller pods, so the deployment can mount the ConfigMap
as a volume.

Example:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: razeedeploy-config
  namespace: razeedeploy
data:
  lock-cluster: "false"
  enable-impersonation: "false"
```

### Lock Cluster

**Key:** `lock-cluster`

**Options:**

- DEFAULT: `false`
  - Allows the controller to continue normal operations on the cluster.
- `true`
  - Prevents the controller from updating resources on the cluster.

### Enable Cluster Wide User Impersonation

**Key:** `enable-impersonation`

**Options:**

- DEFAULT: `false`
  - Prevents the controller from performing [user impersonation](https://github.com/razee-io/RemoteResource#user-impersonation)
    in all namespaces. Continues to allow user impersonation in the `razeedeploy`
    namespace. To prevent privildge escalation, users should be restricted from
    creating razeedeploy resources.
- `true`
  - Allows the controller to perform [user impersonation](https://github.com/razee-io/RemoteResource#user-impersonation)
    in all namespaces. **See important note below about steps that should be taken
    to properly configure this feature before enabling.**

**IMPORTANT:** it is highly advised to set up [ImpersonationWebhook](https://github.com/razee-io/ImpersonationWebhook)
before enabling cluster-wide impersonation. If ImpersonationWebhook is not installed
before enabling impersonation, any user on the cluster that is allowed to create
razeedeploy resources will be able to impersonate any other user. Once the ImpersonationWebhook
controller is installed and all necessary config and authorizations in place, impersonation
can be safely enabled in the `razeedeploy-config` configmap.
