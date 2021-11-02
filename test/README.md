# Testing

This project comes with both integration and unit tests using mocha as test suite.

### Running the tests

In order to run the test suite, you need to have the different components running (DB, API). In order to do so, refer to the [project readme quickstart](/README.md).

In the root directory, you can run all the tests with
```bash
npm run test
```

### Coverage

With the help of `nyc`, check the test coverage with the command:
```bash
npm run cover
```

## Integration tests

End to end tests that will test each API endpoints in different scenarios.

To only run integration tests:
```bash
npm run test:integration
```

## Component tests

Tests applied to components of the code such as server setup.

To only run component tests:
```bash
npm run test:component
```

## Unit tests

Tests applied to sub components or functions of the code such as middlewares, validator functions...

To only run unit tests:
```bash
npm run test:unit
```

## Notes

None.

## Todo list

None.