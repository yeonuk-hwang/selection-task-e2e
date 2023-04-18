const { defineConfig } = require("cypress");
const { cloudPlugin } = require("cypress-cloud/plugin");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return cloudPlugin(on, config);
    },
    baseUrl: "http://localhost:3000",
    // baseUrl: "https://todolist-q456pisw8-ggongjukim.vercel.app/",
  },
});
