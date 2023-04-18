const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    // baseUrl: "https://todolist-q456pisw8-ggongjukim.vercel.app/",
  },
  projectId: "7f84v4",
});
