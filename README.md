# toptal project

This repo is the answer of Joel Barenco to task given by toptal for the recruitment process.

The requirements for the test project are:
- Write a REST API that shows time in different timezones
- API Users must be able to create an account and log in.
- All API calls must be authenticated.
- When logged in, a user can see, edit and delete timezones he entered.
- Implement 2 roles with different permission levels: a regular user would only be able to CRUD on their owned records, and an admin would be able to CRUD all users and all user records.
- When a timezone is entered, each entry has a Name, Name of the city in timezone, the difference to GMT time.
- The API must be able to return data in the JSON format.
- In any case, you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly. Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.
- Write unit tests..

## Quick start

In order to set up the architecture locally, follow the below instructions:

```bash
cd docker/local/
docker-compose up --build
```

Note: you can avoid the `--build` option after the first time.

## API endpoints

Check Postman Collection for the list of endpoints.

## Infrastructure

There were no requirements to provide a cloud infrastructure for this project, but if there were, this section would highlight the different bits of cloud infrastructure written as Infrastructure As Code to deploy and serve the API.

## Depedencies

No dependencies.

## Deployment

No deployment strategy as there is no cloud infrastructure. But this could tipically be done via AWS CloudPipeline / CodeBuild / CloudFormation.

## Monitoring

No monitoring provided. But this could be done with third-party services like datadog, or AWS own tool CloudWatch or something more in-house like Graphana.

## Tests

Check `/test/README.md`.

In order to make them work, you should set up the system as explain in `## Quick start`.

---

## Notes

None.

## Improvements

- change user id from email to uuid to avoid showing email to all when fetching all users. Would also be more efficient for the index lookup on the DB.
- create a new table for auth information like `passwordHash` to avoid having to remove it everywhere in the code
- remove duplicate check on required field from inputValidation as it's done by casl already