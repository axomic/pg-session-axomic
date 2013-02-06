pg-session-axomic
=================

*An Express-compatible session store for Postgres databases.*

##### Installation

Install with the following:

```
npm install git+ssh://git@github.com:axomic/pg-session-axomic.git
```

#### Passing Options

Options to the module can be passed during initialization, for example:


```
var globalConfig        = require('./globals/globalConfig');
var  pgSessionStore      = require('pg-session-axomic')(express);


new pgSessionStore({globals:globalConfig}
```



Currently the following *key:values* are supported:  

* `databaseConnectionPostgres`, so for example you can specify it in your *globalConfig.js*:

```

var globalConfig = {
	databaseConnectionPostgres: 'postgresaxomic://admin:password@localhost:5432/db'
};

module.exports = globalConfig;
```
*Note:* ** `databaseConnectionPostgres` is required for this module to work correctly.**





##### Installing Dependencies

The dependencies are specified in `package.json` and can be installed with

```
npm install
```
from inside module directory.

##### Dependencies

Main dependency is `node-orm2-axomic` available at:

```
"node-orm2-axomic": "git+ssh://git@github.com:axomic/node-orm2-axomic.git"
```

