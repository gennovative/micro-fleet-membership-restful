# Gennova backend RESTful web service for Membership

Exposes RESTful APIs to operate accounts and roles.

---
## INSTALLATION

`npm i`: To install dependencies.
`gulp` to transpile TypeScript.

## TEST

- Execute `npm start` to start web server.
- Send a GET request to `http://localhost:3000/` to check if it works.

## DEVELOPMENT

`gulp watch`: To transpile and watch for edit.


## RELEASE

- Jump to script folder: `cd ./docker`
- Create Docker image: `bash ./create-image.sh`
- Deploy services to Docker swarm`: `sudo bash ./deploy.sh`
- Remove services from Docker swarm`: `sudo bash ./undeploy.sh`


## VERSIONS

### 1.0.0
- Support CRUD for accounts and account roles.
- Can login and issue tokens..
