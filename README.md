# Ag-Vdifn
[![Circle CI](https://circleci.com/gh/uwent/ag-vdifn.svg?style=svg&circle-token=f8cd109ae0fe656784844b0870aeb501ade6bfa6)](https://circleci.com/gh/uwent/ag-vdifn)

## Description
University of Wisconsin Vegetable Disease & Insect Forecasting Network

## Dependencies

Ruby version `3.0.x`

Rails version `6.1.x`

## Setup
1. Install [Yarn](https://classic.yarnpkg.com/en/)
2. Install dependencies with `bundle install` and `yarn install`
3. Setup database with `rails db:setup db:schema:load db:seed`

## Launch local instance
1. Run [ag-weather](https://github.com/uwent/ag-weather) server on port 8080 with `ag-weather> rails s -p 8080`
2. Run ag-vdifn server with `rails s`
3. Visit `localhost:3000` in browser

## Running Tests
1. RSpec: `bundle exec rspec`
2. Jest: `yarn jest`

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
