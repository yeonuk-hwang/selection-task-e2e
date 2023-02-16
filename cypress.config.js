const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://dapper-gecko-2e66cf.netlify.app/",
    // baseUrl: "http://localhost:3000",
  },
});
