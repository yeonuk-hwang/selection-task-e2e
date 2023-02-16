// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --

const API = "https://pre-onboarding-selection-task.shop";

Cypress.Commands.add("login", (email, pw) => {
  cy.intercept("POST", /signin/, (req) => {
    req.url = API + "/auth/signin";
  }).as("signin");

  cy.visit("/signin", { failOnStatusCode: false });
  cy.get("[data-testid=email-input]").type(email);
  cy.get("[data-testid=password-input]").type(pw).blur();
  cy.get("[data-testid=signin-button]").click();
  cy.wait("@signin");
});
