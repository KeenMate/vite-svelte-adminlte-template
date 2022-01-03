# The AdminLTE svelte template
This project is meant to be replacement for `sveltejs/template` when cloning new svelte project.
It is aimed to remove the repetitive tasks required to set up fully functioning svelte spa administration
so that you can jump to business logic straight away.

## Template features:
- Functioning Admin SPA from the start
- Ready for socket-based communication with server
- Ready for direct authentication against OIDC (azure)
- Laid file structure
- Basic helpers of all categories (hand written for specific use-cases..)
- Ready user-friendly logs viewing on shortcut: `ctrl+0` (requires special logging though)

## Disclaimer
As of writing this, it is still mainly used by us, so I would not accept it as "state of the art" 🙂

## Steps to get you going

### Clone template
Run the following inside your new project's directory: `npx degit keenmate/rollup-svelte-adminlte-template`

### Install deps
`npm i`

### Test the template
`npm run dev`

## Project signpost

### Routes
`/src/routes`

### Components
We store intermediate components in `/src/controls` directory

### Styling
Main style file is located at: `/src/assets/css/main.scss`.
This file contains reference to `/src/assets/css/variables.scss` where you can override AdminLTE and other CSS variables.

### Constants
`/src/constants`

#### Honorable mentions
- `./urls.js` - Where application urls are defined (here we use a compile-time config to provide env-specific URLs)

### Server communication
`/src/providers`
`/src/providers/socket`

### Uncaught errors
When unexpected error occurs we prevent Svelte App to become "frozen" by overlaying it with error screen from where the user must reload the page (as of now we do not have better solution).

This error supervision code is in `/src/main.js`

### Global stores
`/src/stores`

### Static assets
Static files are stored in `/src/assets/static` out of where they are copied to `/public` directory as-is (see `/rollup.config.js`)
