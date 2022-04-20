# Ag-Vdifn

[![Circle CI](https://circleci.com/gh/uwent/ag-vdifn.svg?style=svg&circle-token=f8cd109ae0fe656784844b0870aeb501ade6bfa6)](https://circleci.com/gh/uwent/ag-vdifn)

## Description

University of Wisconsin Vegetable Disease & Insect Forecasting Network

## Dependencies

`Ruby 3.0.x`
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
rbenv install 3.1.2 # or latest version

# update bundler to latest
gem install bundler
```

`Postgres 12` and `gem pg`
```bash
# install postgres
sudo apt -y install postgresql-12 postgresql-client-12 libpq-dev
sudo service postgresql start

# install gem pg
gem install pg

# Set postgres user password to 'password'
sudo su - postgres
psql -c "alter user postgres with password 'password'"
exit
```

`node` and `yarn`
```bash
# install nodejs
sudo apt install nodejs
node -v

# install npm
sudo apt install npm
npm -v

# install yarn
sudo npm install --global yarn
yarn -v
```

## Setup

1. Install core dependencies listed above.
2. Install ruby gems with `bundle install` and node packages with `yarn install`
3. Setup database with `bundle exec rails db:setup`
4. Run [ag-weather](https://github.com/uwent/ag-weather) server on port 8080 with `ag-weather> rails s`
5. Run ag-vdifn server with `bin/dev`
6. Launch site by visiting `localhost:3000` in browser

## Running Tests

### Lint

```bash
# check ruby code for style
bundle exec standardrb --fix
```

### Rspec (Ruby tests)

```bash
bundle exec rspec
```

### Jest (Node tests)

```bash
yarn test
```

### Build

```bash
yarn build
```

## Deployment

Work with db admin to authorize your ssh key for the deploy user. Confirm you can access the dev and production servers:

* `ssh deploy@dev.agweather.cals.wisc.edu -p 216`
* `ssh deploy@agweather.cals.wisc.edu -p 216`

Then run the following commands from the main branch to deploy:

* Staging: `cap staging deploy`
* Production: `cap production deploy`

Deployment targets:

* Staging: [https://dev.agweather.cals.wisc.edu/vdifn](https://dev.agweather.cals.wisc.edu/vdifn)
* Production: [https://agweather.cals.wisc.edu/vdifn](https://agweather.cals.wisc.edu/vdifn)
