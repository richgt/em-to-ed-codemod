# em-to-ed


## Usage

```
npx github:patocallaghan/em-to-ed-codemod em-to-ed path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [intercom-model](#intercom-model)
* [model-attr](#model-attr)
* [model-belongs-to](#model-belongs-to)
* [model-has-many](#model-has-many)
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
<a id="model-belongs-to">**model-belongs-to**</a>

**Input** (<small>[model-belongs-to.input.js](transforms/em-to-ed/__testfixtures__/model-belongs-to.input.js)</small>):
```js
import IntercomModel from 'embercom/models/types/intercom-model';
import { belongsTo } from 'ember-model';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import Team from 'embercom/models/team';

export default IntercomModel.extend({
  tag: belongsTo(Tag, { key: 'tag_id', embedded: true }),
  admin: belongsTo(Admin, { key: 'admin_id', embedded: false }),
  team: belongsTo(Team, { key: 'team_id' }),
});

```

**Output** (<small>[model-belongs-to.output.js](transforms/em-to-ed/__testfixtures__/model-belongs-to.output.js)</small>):
```js
import DS from 'ember-data';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import Team from 'embercom/models/team';

export default DS.Model.extend({
  tag: DS.attr('ember-model-belongs-to', {
    modelClass: Tag,
    embedded: true,
  }),
  admin: DS.attr('ember-model-belongs-to', {
    modelClass: Admin,
    embedded: false,
  }),
  team: DS.attr('ember-model-belongs-to', {
    modelClass: Team,
    embedded: false,
  }),
});

```
---
<a id="model-has-many">**model-has-many**</a>

**Input** (<small>[model-has-many.input.js](transforms/em-to-ed/__testfixtures__/model-has-many.input.js)</small>):
```js
import IntercomModel from 'embercom/models/types/intercom-model';
import { hasMany } from 'ember-model';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import Team from 'embercom/models/team';

export default IntercomModel.extend({
  tags: hasMany(Tag, { key: 'tags', embedded: true }),
  admin: hasMany(Admin, { key: 'admin_id', embedded: false }),
  team: hasMany(Team, { key: 'team_id' }),
});

```

**Output** (<small>[model-has-many.output.js](transforms/em-to-ed/__testfixtures__/model-has-many.output.js)</small>):
```js
import DS from 'ember-data';
import Tag from 'embercom/models/tag';
import Admin from 'embercom/models/admin';
import Team from 'embercom/models/team';

export default DS.Model.extend({
  tags: DS.attr('ember-model-has-many', {
    modelClass: Tag,
    embedded: true,
  }),
  admin: DS.attr('ember-model-has-many', {
    modelClass: Admin,
    embedded: false,
  }),
  team: DS.attr('ember-model-has-many', {
    modelClass: Team,
    embedded: false,
  }),
});

```
<!--FIXTURE_CONTENT_END-->