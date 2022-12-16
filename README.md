# be-nc-games

Hosted at https://be-nc-games.onrender.com

## Summary

This project is an API that allows you to interface with a database storing reviews about board games. See below for further information regarding your use case

## I want to use the endpoints provided

Visit [this website](https://be-nc-games.onrender.com/api) for a list of endpoints

// Not sure what other kind of info to put here, the link explains all the endpoints

// Maybe what program they can use to make PATCH, POST and DELETE requests? Which would just be a link to Insomnia i think?

## I want to host this API locally

For this, you'll need to clone this project so you have access to it locally

### Instructions for cloning

<ol>
  <li> Clone from <code>https://github.com/stormytuna/be-nc-games.git</code> with your preferred method
  <li> Create <code>.env.production</code>, <code>.env.development</code> and <code>.env.test</code> files
  <li> Add <code>PGDATABASE=nc_games</code> to <code>.env.development</code> and <code>PGDATABASE=nc_games_test</code> to <code>.env.test</code>. If you want to host this database online, you'll also want to set <code>DATABASE_URL</code> in <code>.env.production</code>
</ol>

Now you can run `npm install` to install all the node packages required by this project

Then you should familiarise yourself with the tests and scripts provided

<ul>
  <li> <code>npm setup-dbs</code> will set up our databases using <code>./db/setup.sql</code>
  <li> <code>npm seed</code> will seed our local databases 
  <li> <code>npm test</code> or <code>npm t</code> will run the full testing suite
  <li> <code>prepare</code> will initialise husky
  <li> <code>start</code> will start our express server
  <li> <code>seed-prod</code> will seed the production database
</ul>

Please note
