# RemixJS / PrimeReact

- [Remix Docs](https://remix.run/docs)
- [PrimeReact Docs](https://primefaces.org/primereact/setup/)

## Development Windows

Start your app in development mode:

```sh
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

## Development Linux
For Linux

Change in package.json
```sh
"scripts": {
    ...
    "install:fonts": "rsync -r node_modules/primeicons/fonts/ public/build/_assets/fonts/",
    ...
  },
```
And 

```sh
  "dependencies": {
    ...
    "rsync": "^0.6.1",
    "primeflex": "^3.2.1",
    "primeicons": "^6.0.1",
    "primereact": "^8.6.1",
    ...
  }
```
```sh
npm run dev
```
```sh
npm run install:fonts
```
```sh
npm run dev
```