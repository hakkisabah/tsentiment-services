# tsentiment-services
tsentiment services have adopted microarchitecture. It has been tried to provide intelligibility with endpoints that are suitable for each request and that only do their own job.

All components of tsentiment services are hosted on Amazon Web Services (Lambda, S3 etc.)

This service has been developed for the tsentiment package written in R programming language. The initial development purpose of the service is to fetch the latest tweets from Twitter in line with the parameters set in the tsentiment package. It is foreseen that these transactions will take place over the Web application in the future, and various analyzes will also be available

## Development

All service folders contain .env-example and serverenv-example.json files

### Local

With sample file, you can create your own .env file and develop in your local environment

Note: Note that you have to `npm install` first on each folder, and you will need nodemon(global installation) and dotenv for local development. Also, if you want to work locally, it is recommended to use the dotenv package wherever process.env.XXX is used. It's always good to start from the first logger folder :)

For local :
`npm start`

### AWS(Amazon Web Services)

### Requirements

#### AWS KEYS

- AWS Acces Keys  (<a href="https://console.aws.amazon.com/iam/home#/security_credentials">Create And GET</a>) (And you should follow images this <a href="https://dinamikfikir.com/content/aws-access-key-nasil-olusturulur">link</a> for how to)
- AWS CLI (You will define to pc AWS Keys)

#### Lambda

- Create VPC and Subnets(If you use ElastiCache for redis service) 
- Type and enter `npm run deploy` each service folder after configure serverenv.json
- If you use ElastiCache you will need VPC configuration for redis service Lambda function