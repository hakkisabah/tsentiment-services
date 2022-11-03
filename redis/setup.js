const { AWS } = require("./setup/AWS");
const createTables = require("./setup/createTables");
const iam = new AWS.IAM({ apiVersion: "2010-05-08" });
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const lambda = new AWS.Lambda({ apiVersion: "2015-03-31" });


// name and stage define automatically by serverless
const {name} = require("./package.json")
const stage = "redis";
// function "-api" is defined in serverless.yml file as a function name
const functionName = `${name}-${stage}-api`;
const requiredPolicies = ["AmazonDynamoDBFullAccess"];

const listFunctions = async (lambda) => {
  const params = {};
  return await lambda.listFunctions(params).promise();
};

const isPoliciesAttached = async (iam, RoleName, policiesName) => {
  const { AttachedPolicies } = await iam
    .listAttachedRolePolicies({ RoleName })
    .promise();
  return AttachedPolicies.some((policy) => policy.PolicyName === policiesName);
};

const addPolicies = async (iam, RoleName, policiesName) => {
  const attachedPolicy = await iam
    .attachRolePolicy({
      PolicyArn: `arn:aws:iam::aws:policy/${policiesName}`,
      RoleName: RoleName,
    })
    .promise();
  console.log(
    `${policiesName} Policies attached successfuly =>`,
    attachedPolicy
  );
};

const addPolicyToFunction = async (iam, fName) => {
  const listedFunction = await listFunctions(lambda);
  const func = listedFunction.Functions.find((f) => f.FunctionName === fName);
  console.log("FunctionName: ", func.FunctionName);
  if (func.FunctionName === fName) {
    const RoleName = func.Role.split("/")[func.Role.split("/").length - 1];

    for (let i = 0; i < requiredPolicies.length; i++) {
      const isAttached = await isPoliciesAttached(
        iam,
        RoleName,
        requiredPolicies[i]
      );
      if (!isAttached) {
        await addPolicies(iam, RoleName, requiredPolicies[i]);
      } else {
        console.log(`${requiredPolicies[i]} is already attached to this role.`);
      }
    }
  }
};

addPolicyToFunction(iam, functionName);
const tables = ["usercache"]
dynamodb.listTables({}, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else {
    const tablesToCreate = {};
    tables.forEach((requiredTable) => {
      if (!data.TableNames.includes(`${requiredTable}s`)) {
        tablesToCreate[requiredTable] = {
          readCapacity: 10,
          writeCapacity: 10,
        };
      }
    }); // successful response
    createTables(tablesToCreate);
  }
});