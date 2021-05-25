# Email Service
Abstraction of 2 email providers: [MailGun](https://www.mailgun.com/) and [SendGrid](https://sendgrid.com/).

## Live Demo
* Swagger page for backend service [http://34.116.123.6/api/](http://34.116.123.6/api/)
* Simple Vue application to act as a client of the above backend service
    * Static web page [http://35.244.110.94/](http://35.244.110.94/)
    * Github repo [https://github.com/namnn96/email-client](https://github.com/namnn96/email-client)

## Pre-requisites
* Node v12+ and npm 6+
* Docker
* Redis
* MailGun and SendGrid test accounts

## Usage

#### Service Structure
* `src/app/api` - An API gateway responsible for accepting requests and putting in a job queue
* `src/app/worker` - One or more worker instances responsible for picking up and processing the jobs

#### Fail Rate
Use `fail-rate` endpoints to force provider(s) to fail at a certain rate.

#### Local Development
* Setup a local Redis server

    ```python
    docker run -d -p 6379:6379 redis
    ```
* Create a `.env` file from the `.env.example` provided
* Add missing environment variables
* Start api instance (accessible at [http://localhost:3000/api/](http://localhost:3000/api/))

    ```python
    npm run start:dev:api
    ```
* Start worker instance

    ```python
    npm run start:dev:worker
    ```

#### Testing
Simple unit testing for API controllers.
```python
npm run test
```

## To-do
#### Retry Policy
* Retry policy for a job OR
* Retry policy after a certain period of time if all email providers fail

#### Job Queue
* Return job's ID on top of 201 HTTP status
* Expose endpoint to retrieve job status
* Expose channel to post job status for any subscribers
* Periodically export completed/failed jobs from queue and clean up Redis queue 

#### Logging
* Replace current console log with a better cloud-based traffic (e.g. SumoLogic) 

#### Testing
* Extend current unit tests to cover worker services
* e2e tests to cover input validations
