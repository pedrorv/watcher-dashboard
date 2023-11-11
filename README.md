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

## Application Routing

This application uses `@solidjs/router` for client-side routing, providing a seamless user experience. Below is an overview of the available routes and their respective responsibilities:

### Routes Overview

- `/auth`: This route leads to the authentication page where users can sign in using the AUTH_TOKEN from [watcher-server](https://github.com/pedrorv/watcher-server).
- `/`: Displays the home page of the application, which lists various applications or services available to the authorized user. Unauthorized users are redirected to `/auth`.
- `/:appId/sessions`: Shows session information for a specific application. The `:appId` parameter in the URL is used to fetch and display session data relevant to the selected application. Also required authentication to be accessed.
- `/session/:id/recording`: This route is used to display a specific session's recording. The session is identified using the `:id` parameter in the URL. This is a public route.
- `/session/:id/heatmap`: Dedicated to showing a heatmap for a particular session. Similar to the session recording route, it uses the `:id` parameter to specify which session's heatmap to display. Also a public route.

## Deployment

Learn more about deploying your application in the [documentation](https://vitejs.dev/guide/static-deploy.html).
