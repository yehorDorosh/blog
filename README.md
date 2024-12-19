# Blog

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Setup access to FireBase from server

linux
`export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"`
windows
`$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\username\Downloads\service-account-file.json"`

## SSH

### Add pub key to server

`type $env:USERPROFILE\.ssh\id_rsa.pub | ssh root@194.37.80.72 "cat >> .ssh/authorized_keys"`

### Connect

`ssh -i C:\Users\Egor\.ssh\id_rsa root@194.37.80.72`

## PM2

### Show all started nodejs process

`pm2 list`

### Show logs of the process

`pm2 logs blog-site`

### Config

`vim ~/ecosystem.config.js`

### Stop

`pm2 stop all`

### Start

`pm2 start ~/ecosystem.config.js --env production --update-env`
`--no-daemon` - detached

## Restart

`pm2 restart ~/ecosystem.config.js --env production --update-env`

## ENV

### Copy to server

`scp src\environments\environment.ts root@194.37.80.72:/root/blog/src/environments/`
