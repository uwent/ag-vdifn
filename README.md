# Ag-Vdifn

## Description
University of Wisconsin Vegetable Disease & Insect Forecasting Network

## Dependencies

Ruby version `2.7.x`

Rails version `6.1.x`

## Setup
1. Install [Yarn](https://classic.yarnpkg.com/en/)
2. Install dependencies with `bundle install`
3. Add ruby platform gems to lockfile if building on windows machine (`bundle lock --add-platform ruby`)
4. Setup database with `rails db:setup`

## Launch local instance
1. Run [ag-weather](https://github.com/uwent/ag-weather) server on port 8080 with `ag-weather> rails s -p 8080`
2. Run ag-vdifn server with `rails s`
3. Visit `localhost:3030` in browser

## Running Tests
1. RSpec: `bundle exec rspec`
2. Jest: `jest` or `yarn jest`

## Deployment
Work with db admin to authorize your ssh key for the deploy user, then run the following commands from the master branch:

Staging ([dev.agweather.cals.wisc.edu/vdifn](https://dev.agweather.cals.wisc.edu/vdifn)):
```
cap staging deploy
```

Production ([agweather.cals.wisc.edu/vdifn](https://agweather.cals.wisc.edu/vdifn)):
```
cap production deploy
```
