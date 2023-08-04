import * as nconf from "nconf";

nconf.argv()
  .env()
  .defaults({
    PORT: 8080,
    MONGO_HOST: "mongodb://localhost:27017",
    NODE_ENV: "development",
  });

function checkConfig(setting: string) {
  if (!nconf.get(setting)) {
    throw new Error(`You must set ${setting} as an environment variable or in config.json!`);
  }
}

// Check for required settings
checkConfig("PORT");
checkConfig("MONGO_HOST");
checkConfig("NODE_ENV");

export default nconf;
