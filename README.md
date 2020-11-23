Ruby version 2.6.5

Rails 6.0.3.2

Yarn 1.22.5

# Ag-Vdifn
University of Wisconsin Vegetable Disease & Insect Forecasting Network

## Setup

1. Install [Yarn](https://classic.yarnpkg.com/en/)
2. Install dependencies with `bundle install`
3. Setup database with `rails db:setup`
4. Run server with `rails s`
5. Run webpack dev server with `./bin/webpack-dev-server`
5. [ag-weather](https://github.com/adorableio/ag-weather) is set up and running on port 8080


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

Staging:
```
  cap staging deploy
```

Production:
```
  cap production deploy
```
