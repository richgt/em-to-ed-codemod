# em-to-ed


## Usage

```
npx github:patocallaghan/em-to-ed-codemod em-to-ed path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [intercom-model](#intercom-model)
* [model-attr](#model-attr)
* [model-belongs-to__keys-dont-match](#model-belongs-to__keys-dont-match)
* [model-belongs-to__keys-dont-match__existing-computed-object-imports](#model-belongs-to__keys-dont-match__existing-computed-object-imports)
* [model-belongs-to__keys-match](#model-belongs-to__keys-match)
* [model-has-many__keys-dont-match](#model-has-many__keys-dont-match)
* [model-has-many__keys-match](#model-has-many__keys-match)
* [strip-id](#strip-id)
* [transform-types](#transform-types)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="intercom-model">**intercom-model**</a>

**Input** (<small>[intercom-model.input.js](transforms/em-to-ed/__testfixtures__/intercom-model.input.js)</small>):
```js
import IntercomModel from 'embercom/models/types/intercom-model';

export default IntercomModel.extend({});

```

**Output** (<small>[intercom-model.output.js](transforms/em-to-ed/__testfixtures__/intercom-model.output.js)</small>):
```js
import DS from 'ember-data';

export default DS.Model.extend({});

```
---
<a id="model-attr">**model-attr**</a>

**Input** (<small>[model-attr.input.js](transforms/em-to-ed/__testfixtures__/model-attr.input.js)</small>):
```js
import IntercomModel from 'embercom/models/types/intercom-model';
import { attr } from 'ember-model';

export default IntercomModel.extend({
  my_prop: attr(),
});

```

**Output** (<small>[model-attr.output.js](transforms/em-to-ed/__testfixtures__/model-attr.output.js)</small>):
```js
import DS from 'ember-data';

export default DS.Model.extend({
  my_prop: DS.attr(),
});

```
---
<a id="model-belongs-to__keys-dont-match">**model-belongs-to__keys-dont-match**</a>

**Input** (<small>[model-belongs-to__keys-dont-match.input.js](transforms/em-to-ed/__testfixtures__/model-belongs-to__keys-dont-match.input.js)</small>):
```js
import IntercomModel from 'embercom/models/types/intercom-model';
import { belongsTo } from 'ember-model';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import User from 'embercom/models/user';

export default IntercomModel.extend({
  tag: belongsTo(Tag, { key: 'tag_id', embedded: true }),
  admin: belongsTo(Admin, { key: 'admin_id', embedded: false }),
  user: belongsTo(User, { key: 'user_id' }),
});

```

**Output** (<small>[model-belongs-to__keys-dont-match.output.js](transforms/em-to-ed/__testfixtures__/model-belongs-to__keys-dont-match.output.js)</small>):
```js
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import DS from 'ember-data';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import User from 'embercom/models/user';

export default DS.Model.extend({
  tag_id: DS.attr('ember-model-belongs-to', { modelClass: Tag, embedded: true }),
  tag: alias('tag_id'),

  admin_id: DS.attr(),
  admin: computed('admin_id', function() {
    return Admin.find(this.admin_id);
  }),

  user_id: DS.attr(),
  user: computed('user_id', function() {
    return User.find(this.user_id);
  }),
});

```
---
<a id="model-belongs-to__keys-dont-match__existing-computed-object-imports">**model-belongs-to__keys-dont-match__existing-computed-object-imports**</a>

**Input** (<small>[model-belongs-to__keys-dont-match__existing-computed-object-imports.input.js](transforms/em-to-ed/__testfixtures__/model-belongs-to__keys-dont-match__existing-computed-object-imports.input.js)</small>):
```js
import IntercomModel from 'embercom/models/types/intercom-model';
import { belongsTo } from 'ember-model';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import { application } from '@ember/object';
import { or } from '@ember/object/computed';

export default IntercomModel.extend({
  tag: belongsTo(Tag, { key: 'tag_id', embedded: true }),
  admin: belongsTo(Admin, { key: 'admin_id', embedded: false }),
});

```

**Output** (<small>[model-belongs-to__keys-dont-match__existing-computed-object-imports.output.js](transforms/em-to-ed/__testfixtures__/model-belongs-to__keys-dont-match__existing-computed-object-imports.output.js)</small>):
```js
import DS from 'ember-data';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import { application, computed } from '@ember/object';
import { or, alias } from '@ember/object/computed';

export default DS.Model.extend({
  tag_id: DS.attr('ember-model-belongs-to', { modelClass: Tag, embedded: true }),
  tag: alias('tag_id'),

  admin_id: DS.attr(),
  admin: computed('admin_id', function() {
    return Admin.find(this.admin_id);
  }),
});

```
---
<a id="model-belongs-to__keys-match">**model-belongs-to__keys-match**</a>

**Input** (<small>[model-belongs-to__keys-match.input.js](transforms/em-to-ed/__testfixtures__/model-belongs-to__keys-match.input.js)</small>):
```js
import IntercomModel from 'embercom/models/types/intercom-model';
import { belongsTo } from 'ember-model';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import User from 'embercom/models/user';

export default IntercomModel.extend({
  tag: belongsTo(Tag, { key: 'tag', embedded: true }),
  admin: belongsTo(Admin, { key: 'admin', embedded: false }),
  user: belongsTo(User, { key: 'user' }),
});

```

**Output** (<small>[model-belongs-to__keys-match.output.js](transforms/em-to-ed/__testfixtures__/model-belongs-to__keys-match.output.js)</small>):
```js
import DS from 'ember-data';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import User from 'embercom/models/user';

export default DS.Model.extend({
  tag: DS.attr('ember-model-belongs-to', { modelClass: Tag, embedded: true }),
  admin: DS.attr('ember-model-belongs-to', { modelClass: Admin, embedded: false }),
  user: DS.attr('ember-model-belongs-to', { modelClass: User, embedded: false }),
});

```
---
<a id="model-has-many__keys-dont-match">**model-has-many__keys-dont-match**</a>

**Input** (<small>[model-has-many__keys-dont-match.input.js](transforms/em-to-ed/__testfixtures__/model-has-many__keys-dont-match.input.js)</small>):
```js
import IntercomModel from 'embercom/models/types/intercom-model';
import { hasMany } from 'ember-model';
import Permission from 'embercom/models/permission';
import User from 'embercom/models/user';
import Team from 'embercom/models/team';
import ExternalProfile from 'embercom/models/external-profile';

export default IntercomModel.extend({
  availablePermissions: hasMany(Permission, { key: 'available_roles', embedded: true }),
  users: hasMany(User, { key: 'user_ids', embedded: false }),
  team: hasMany(Team, { key: 'team_ids' }),
  externalProfile: hasMany(ExternalProfile),
});

```

**Output** (<small>[model-has-many__keys-dont-match.output.js](transforms/em-to-ed/__testfixtures__/model-has-many__keys-dont-match.output.js)</small>):
```js
import { alias } from '@ember/object/computed';
import DS from 'ember-data';
import Permission from 'embercom/models/permission';
import User from 'embercom/models/user';
import Team from 'embercom/models/team';
import ExternalProfile from 'embercom/models/external-profile';

export default DS.Model.extend({
  available_roles: DS.attr('ember-model-has-many', { modelClass: Permission, embedded: true }),
  availablePermissions: alias('available_roles'),

  // CODE MIGRATION HINT: This is an async Ember Model `hasMany` relationship and due to ambiguity it can't be automatically migrated. See the following docs for advice on how to migrate this relationship https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#updating-hasmany-relationships
  users: hasMany(User, { key: 'user_ids', embedded: false }),

  // CODE MIGRATION HINT: This is an async Ember Model `hasMany` relationship and due to ambiguity it can't be automatically migrated. See the following docs for advice on how to migrate this relationship https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#updating-hasmany-relationships
  team: hasMany(Team, { key: 'team_ids' }),

  // CODE MIGRATION HINT: This is an async Ember Model `hasMany` relationship and due to ambiguity it can't be automatically migrated. See the following docs for advice on how to migrate this relationship https://github.com/intercom/embercom/wiki/Converting-a-model-from-ember-model-to-ember-data#updating-hasmany-relationships
  externalProfile: hasMany(ExternalProfile),
});

```
---
<a id="model-has-many__keys-match">**model-has-many__keys-match**</a>

**Input** (<small>[model-has-many__keys-match.input.js](transforms/em-to-ed/__testfixtures__/model-has-many__keys-match.input.js)</small>):
```js
import IntercomModel from 'embercom/models/types/intercom-model';
import { hasMany } from 'ember-model';
import Tag from 'embercom/models/tag';

export default IntercomModel.extend({
  tags: hasMany(Tag, { key: 'tags', embedded: true }),
});

```

**Output** (<small>[model-has-many__keys-match.output.js](transforms/em-to-ed/__testfixtures__/model-has-many__keys-match.output.js)</small>):
```js
import DS from 'ember-data';
import Tag from 'embercom/models/tag';

export default DS.Model.extend({
  tags: DS.attr('ember-model-has-many', { modelClass: Tag, embedded: true }),
});

```
---
<a id="strip-id">**strip-id**</a>

**Input** (<small>[strip-id.input.js](transforms/em-to-ed/__testfixtures__/strip-id.input.js)</small>):
```js
import IntercomModel from 'embercom/models/types/intercom-model';
import JsonType from 'embercom/models/types/json';

export default IntercomModel.extend({
  id: attr(),
  someBoolean: attr(Boolean),
});

```

**Output** (<small>[strip-id.output.js](transforms/em-to-ed/__testfixtures__/strip-id.output.js)</small>):
```js
import DS from 'ember-data';

export default DS.Model.extend({
  someBoolean: DS.attr('boolean'),
});

```
---
<a id="transform-types">**transform-types**</a>

**Input** (<small>[transform-types.input.js](transforms/em-to-ed/__testfixtures__/transform-types.input.js)</small>):
```js
import IntercomModel from 'embercom/models/types/intercom-model';
import { attr } from 'ember-model';
import JsonType from 'embercom/models/types/json';

export default IntercomModel.extend({
  emptyTransform: attr(),
  someJson: attr(JsonType),
  someArray: attr(Array),
  someBoolean: attr(Boolean),
  someNumber: attr(Number),
  someString: attr(String),
});

```

**Output** (<small>[transform-types.output.js](transforms/em-to-ed/__testfixtures__/transform-types.output.js)</small>):
```js
import DS from 'ember-data';

export default DS.Model.extend({
  emptyTransform: DS.attr(),
  someJson: DS.attr(),
  someArray: DS.attr('array'),
  someBoolean: DS.attr('boolean'),
  someNumber: DS.attr('number'),
  someString: DS.attr('string'),
});

```
<!--FIXTURES_CONTENT_END-->