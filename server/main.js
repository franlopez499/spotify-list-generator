// Server entry point, imports all server code

import '/imports/startup/server/index.js';
import '/imports/startup/both';

ServiceConfiguration.configurations.update(
    { "service": "spotify" },
    {
      $set: {
        "clientId": "06ff1d3c7b074699b9a3e8da63ba2d51",
        "secret": "4676bc31c3b44a3db73e95c74ce3e0d3"
      }
    },
    { upsert: true }
  );