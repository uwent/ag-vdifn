# Ag-Vdifn

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/uwent/ag-vdifn/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/uwent/ag-vdifn/tree/main)

## Description

University of Wisconsin Vegetable Disease & Insect Forecasting Network

## Dependencies

### Ruby

```bash
# install rbenv
sudo apt -y install rbenv

# install ruby-build
mkdir -p "$(rbenv root)"/plugins
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build

# or update ruby-build if already installed
git -C "$(rbenv root)"/plugins/ruby-build pull

# may need to force git to use https
# per https://stackoverflow.com/questions/70663523/the-unauthenticated-git-protocol-on-port-9418-is-no-longer-supported
git config --global url."https://github.com/".insteadOf git://github.com/

# install ruby with rbenv
rbenv install 3.4.2 # or latest version

# update bundler to latest
gem install bundler

# update gems...
bundle update

# OR if migrating to a new version of Ruby...
rm Gemfile.lock
bundle install
```

When upgrading Ruby versions, need to change the version number in the documentation above, in `.ruby-version`, and in `config/deploy.rb`.

### Rails

When upgrading to a new version of Rails, run the update task with `THOR_MERGE="code -d $1 $2" rails app:update`. This will use VSCode as the merge conflict tool.

### Postgres

```bash
# install postgres
sudo apt -y install postgresql-16 postgresql-client-16 libpq-dev
sudo service postgresql start

# Set postgres user password to 'password'
sudo su - postgres
psql -c "alter user postgres with password 'password'"
exit

# install gem pg
gem install pg
```

### Node

`node` and `pnpm`

```bash
# install npm
sudo apt install npm
npm -v

# install n, Node's version manager
sudo npm install -g n

# install the latest stable version of Node
sudo n stable
node -v

# install pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -
pnpm -v

# install packages
pnpm install

# or update packages to latest - be sure to test for breaking changes after updates
pnpm up --latest
```

## Initial Setup

1. Install core dependencies listed above.
2. Install ruby gems with `bundle install` and node packages with `pnpm install`
3. Setup database with `bundle exec rails db:setup`
4. Run [ag-weather](https://github.com/uwent/ag-weather) server on port 8080 with `ag-weather> bundle exec rails s`
5. Run ag-vdifn server with `bin/dev`
6. Launch site by visiting `localhost:3000` in browser

## Running Tests

```bash
# check ruby code for style
bundle exec standardrb --fix

# Ruby specs
bundle exec rspec

# JS specs
pnpm test

# Check for build success
pnpm build
```

## Deployment

Work with db admin to authorize your ssh key for the deploy user. Confirm you can access the dev and production servers:

- `ssh deploy@dev.agweather.cals.wisc.edu -p 216`
- `ssh deploy@agweather.cals.wisc.edu -p 216`

Then run the following commands from the main branch to deploy:

- Staging: `cap staging deploy`
- Production: `cap production deploy`

Deployment targets:

- Staging: [https://dev.agweather.cals.wisc.edu/vdifn](https://dev.agweather.cals.wisc.edu/vdifn)
- Production: [https://agweather.cals.wisc.edu/vdifn](https://agweather.cals.wisc.edu/vdifn)
