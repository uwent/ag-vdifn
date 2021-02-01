Ruby version 2.6.5

Rails 6.0.3.4

Yarn 1.22.5

# Ag-Vdifn
University of Wisconsin Vegetable Disease & Insect Forecasting Network

## Setup
1. Install [Yarn](https://classic.yarnpkg.com/en/)
2. Install dependencies with `bundle install`
3. Add ruby gems to lockfile if building on windows machine (`bundle lock --add-platform ruby')
4. Setup database with `rails db:setup`

## Launch local instance
1. Run [ag-weather](https://github.com/adorableio/ag-weather) server on port 8080 (`ag-weather> rails s -p 8080`)
2. Run ag-vdifn server with `rails s`
3. Run webpack dev server (if necessary) with `./bin/webpack-dev-server`
4. Visit `localhost:3030` in browser

## Running Tests
#### RSpec
```
bundle exec rspec
```
#### Jest
```
jest
```

## Deployment
Work with db admin to authorize your ssh key for the deploy user, then run the following commands from the master branch:

[Staging](https://dev.agweather.cals.wisc.edu/vdifn):
```
cap staging deploy
```

[Production](https://agweather.cals.wisc.edu/vdifn):
```
cap production deploy
```
