# Watcher Dashboard

This project is a simple dashboard to display usage data collected by the [watcher](https://github.com/pedrorv/watcher) project. You also need to fetch data from a [watcher-server](https://github.com/pedrorv/watcher-server). Protected routes can only be acessed by passing the `AUTH_TOKEN` from the [watcher-server](https://github.com/pedrorv/watcher-server).

## Usage

```bash
$ npm install
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode. Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

You can also run in a specific mode using :

```bash
$ npm run dev -- --mode development|staging|production
```

### `npm run build`

Builds the app for production to the `dist` folder. It correctly bundles Solid in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed!

## Environment Variables

Learn more about configuring your environment variables in the [documentation](https://v2.vitejs.dev/guide/env-and-mode.html). All variables are defined in the example `.env` file.

## Deployment

Learn more about deploying your application in the [documentation](https://vitejs.dev/guide/static-deploy.html).
