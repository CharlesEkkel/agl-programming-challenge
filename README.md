# AGL Programming Challenge

## Result

See the [app on github pages](https://charlesekkel.github.io/agl-programming-challenge/).

## Approach

In my approach to the AGL's pet data display task, I have used ReactJS to create a simple Single Page App which displays the required data after requesting it from the given API server. I've used create-react-app to do so, which is suitable enough for this purpose given it's ease to get running and the simplicity of the task. Anything more complex would ideally have a server and a proper web framework.

See `src/components/CatLists.tsx` for most of the relevant code.

Things worth noting (in terms of 'best practices'):

- Use of typescript to catch type errors at build time.
- Fully documented code.
- Repeated code abstracted into separate functions or components.
- JSON schemas created using zod, to safely validate data incoming from the API.
- Errors are safely recovered from and clearly displayed to the user.
- All basic functionality has automatic tests.
- Occasional use of lodash and other declarative-style programming when manipulating arrays.
- Consistent styling using tailwindCSS.
- Use of rudimentary CI/CD with github actions & pages.

It is worth noting that "best practices" in some situations may also include the following, but I've neglected to do so due to the small scope of this project:

- Hide API requests by performing them at the server side, rather than doing everything on the client's machine. Not really necessary here but would be if the API was private or required a dev key.
- Exhaustive testing - I've done enough, I think, but I haven't checked all edge-cases.
- Server side rendering, which especially when done at build time can improve performance, and can help with SEO, but it's just not very important for a task like this.
- More accessibility support, such as alternative display languages.

## Usage

See this [Github pages deployment](https://charlesekkel.github.io/agl-programming-challenge/) for the end result. Otherwise:

### Dependencies
- NodeJS
- Yarn package manager

### Running the project
1. Clone the project to a local directory.
2. Run `yarn` from within the directory. This will install all needed packages.
3. Proceed with any of the following commands as needed:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
