## Migrations

Information on using the Sequelize CLI to perform database migrations can be viewed (here)[http://docs.sequelizejs.com/en/latest/docs/migrations/].

### Template 

To create a template, use the following:

```bash
npx sequelize-cli migration:generate --name migration-skeleton
```

All migration javascript files should be placed in the migrations directory with a name of the form `yyyyMMddhhmm.js`. An example of such a file is:

```javascript
module.exports = {
    up: (queryInterface, sequelize) => {
        return queryInterface.addColumn('article_content', 'gallery_id', sequelize.STRING)
            .catch((e) => {
                if (e.parent.code === "42701") {
                    console.log(`Column(s) gallery_id already exists in article_content. Swallow error`);
                } else {
                    throw e;
                }
            });
    },
    down: (queryInterface, sequelize) => {
        return queryInterface.removeColumn('article_content', 'gallery_id', sequelize.STRING);
    }
};
```

Each file should expose an up function and a down function. The `up` function applies a migration; in this case an extra column is added to the `articles` table. The `down` function should revert the migration applied by the `up` function; in this case removing the new column from the `articles` table.

### Perform a migration

To perform migrations you must be in the `src/` directory. Then run

```bash
$ yarn run migrate
```

Migrations can be reversed by running

```bash
$ yarn run migrate:undo
```

## SEEDERS

As per migrations, we are using the Sequelize CLI to perform database seeding, and the information can be viewed at the same place (here)[http://docs.sequelizejs.com/en/latest/docs/migrations/].

Important difference with migrations: Seeder execution history is not stored anywhere, unlike migrations, which use the SequelizeMeta table. If you wish to change this behavior, please read the Storage section (here)[http://docs.sequelizejs.com/en/latest/docs/migrations/].

### Template 

To create a template, use the following:

```bash
npx sequelize-cli seed:generate --name demo-user
```

All seeder javascript files should be placed in the seeders directory with a name of the form `yyyyMMddhhmm.js`. An example of such a file is:

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
```

Each file should expose an up function and a down function. The `up` function applies a seeder; in this case an extra people are added to the `People` table. The `down` function should revert the migration applied by the `up` function.

### Perform a seeding

To perform a seed you must be in the `src/` directory. Then run

```bash
$ yarn run seed
```

Latest seed can be reversed by running

```bash
$ yarn run seed:undo
```