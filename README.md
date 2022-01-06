# The AdminLTE svelte template

This project is meant to be replacement for `sveltejs/template` when cloning new Svelte project. It is aimed to remove the repetitive tasks required to set up
fully functional Svelte SPA administration so that you can jump to business logic straight away.

## Template features:

- Functional Admin SPA from the start
- Ready for socket-based communication with server
- Ready for direct authentication against OIDC (azure)
- File structure as we think is the best and we follow it vigorously to take almost no time switching from one project to another
- Basic helpers of all categories (hand written for specific use-cases..)
- Ready user-friendly logs viewing on shortcut: `ctrl+0` (requires special logging though)

## Disclaimer

As of writing this, it is still mainly used by us, so we don't consider it to be "state of the art" and you should use it with caution, the _svelte-adminlte_
components are used already in many projects, those are more solid

## Steps to get you going

### Clone template

Scaffold new project: `npx degit keenmate/rollup-svelte-adminlte-template my-project`

### Install deps

`npm i`

### Test the template

`npm run dev`

## Project structure

### Pages

`/src/pages` is where you put your SPA pages, they use AdminLTE or project components and user controls

### Components

`/src/components` is where you put your project related components that are then used in user controls or pages

### User controls

`/src/user-controls` are reusable complex pieces of UI, for example a new password validation tool with password complexity visualiser, that are than used in
multiple pages or user controls

### Modals

`/src/modals` is where you put your (non)modal dialogs, we call them modals because they mostly are but it can be both

### Configuration

Some of our components or other parts of package have option to be configured via the mechanism in `/src/config.js`

#### HTML Title

The title consists of page title (`/src/pages/index.js`, each page has `title` field) and application title (`BASE_HTML_TITLE` in `/.env.dev.json`). These 2
values are combined in `/src/helpers/router-html-title.js` which is called inside `/src/App.svelte` from `Router`'s `routeLoaded` handler.

You can also provide function as a value to page's title

```js
homeRoute = {
    name: "Home",
    // Promise result is not required
    title: async () => await getHomeTitle(),
    url: "/",
    breadcrumb: ["Home"],
    icon: "fas fa-home",
    hide: false
}
```

Or instead, you can also specify page title from page itself
```js
import {setCustomPageTitle} from "/src/stores/page-title"

onMount(() => {
    setTimeout(() => {
        setCustomPageTitle("Custom Page 1")
    }, 1000)
})
```

### Styling

Main style file is located at: `/src/assets/css/main.scss` to which you can append your own styles. This is the place where you can import your own styles /
overrides. It also contains reference to `/src/assets/css/variables.scss` where you can override AdminLTE and other CSS variables.

### Constants

`/src/constants` is where you put your project constants like API paths, default timeouts and so on

#### Urls

- `./urls.js` - Where application urls are defined (here we use a compile-time config to provide env-specific URLs)

## Server communication

`/src/providers` are for REST/IO type data providers, the lowest level code with simple methods that each is atomic and does only one thing, like calling one
specific endpoint, should you desire a more complicated scenario use a manager to combine multiple providers/provider methods.

`/src/providers/socket` are for Websocket type data providers

## Uncaught errors

When unexpected error occurs we prevent Svelte App to become "frozen" by overlaying it with error screen from where the user must reload the page (for the time
being we do not have a better solution).

This error supervision code is in `/src/main.js`

## Global stores

`/src/stores` is where you put your global Svelte stores

## Static assets

`/src/assets/static` is where youu put your static content and from which they are copied to `/public` directory as-is (see `/rollup.config.js`)
