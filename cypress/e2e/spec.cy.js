describe("전체 요구사항 확인", () => {
  const API = "https://www.pre-onboarding-selection-task.shop";

  const GOOD_ID = "hello@world";
  const GOOD_PW = "12345678";

  const BAD_ID = "helloworld";
  const BAD_PW = "1234";

  const TEMP_ID = `${Cypress._.random(0, 1e6)}@tt.com`;
  const TEMP_PW = `${Cypress._.random(1e8, 1e9)}`;

  const ID = "t00@test.com";
  const PW = "12341234";

  const TEMP_TODO_NAME = `todo-${Cypress._.random(0, 1e10)}`;
  const TEMP_TODO_NEW_NAME = `todo-${Cypress._.random(0, 1e10)}`;

  before(() => {
    cy.request({
      url: API + "/auth/signin",
      method: "POST",
      body: {
        email: ID,
        password: PW,
      },
    }).then((res) => {
      cy.request({
        url: API + "/todos/delete/all",
        method: "DELETE",
        auth: {
          bearer: `${res.body.access_token}`,
        },
      });
    });
  });

  it("리다이렉트 /todo -> /signin", () => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.visit("/todo", { failOnStatusCode: false });
    cy.url().should("contain", "/signin");
  });

  it("리다이렉트 /signup -> /todo", () => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.login(ID, PW);
    cy.visit("/signup", { failOnStatusCode: false });
    cy.url().should("contain", "/todo");
  });

  it("리다이렉트 /signin -> /todo", () => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.login(ID, PW);
    cy.visit("/signin", { failOnStatusCode: false });
    cy.url().should("contain", "/todo");
  });

  it("회원가입 및 리다이렉션 성공", () => {
    cy.intercept("POST", /signup/, (req) => {
      req.url = API + "/auth/signup";
    }).as("signup");

    cy.visit("/signup", { failOnStatusCode: false });
    cy.on("uncaught:exception", (err, runnable) => false);
    cy.get("[data-testid=email-input]").type(TEMP_ID);
    cy.get("[data-testid=password-input]").type(TEMP_PW).focused().blur();
    cy.get("[data-testid=signup-button]").click();
    cy.url().should("contain", "/signin");
  });

  it("회원가입 불가 1 - 이메일 조건 불만족", () => {
    cy.visit("/signup", { failOnStatusCode: false });
    cy.get("[data-testid=email-input]").type(BAD_ID);
    cy.get("[data-testid=password-input]").type(GOOD_PW).focused().blur();
    cy.get("[data-testid=signup-button]").should("be.disabled");
  });

  it("회원가입 불가 2 - 비밀번호 조건 불만족", () => {
    cy.visit("/signup", { failOnStatusCode: false });
    cy.get("[data-testid=email-input]").type(GOOD_ID);
    cy.get("[data-testid=password-input]").type(BAD_PW).focused().blur();
    cy.get("[data-testid=signup-button]").should("be.disabled");
  });

  it("로그인 불가 1 - 이메일 조건 불만족", () => {
    cy.visit("/signin", { failOnStatusCode: false });
    cy.get("[data-testid=email-input]").type(BAD_ID);
    cy.get("[data-testid=password-input]").type(GOOD_PW).focused().blur();
    cy.get("[data-testid=signin-button]").should("be.disabled");
  });

  it("로그인 불가 2 - 비밀번호 조건 불만족", () => {
    cy.visit("/signin", { failOnStatusCode: false });
    cy.get("[data-testid=email-input]").type(GOOD_ID);
    cy.get("[data-testid=password-input]").type(BAD_PW).focused().blur();
    cy.get("[data-testid=signin-button]").should("be.disabled");
  });

  it("로그인 화면 방문 성공 및 로그인 성공", () => {
    cy.login(ID, PW);
    cy.url().should("contain", "/todo");
  });

  it("로그인 이후 Todo 생성-수정-삭제", () => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.intercept("**/todos", (req) => {
      req.url = API + "/todos";
    }).as("todos");

    cy.intercept("**/todos/*", (req) => {
      const endpoint = req.url.split("/");
      const id = endpoint[endpoint.length - 1];
      req.url = API + "/todos/" + id;
    }).as("todo");

    cy.intercept("/todos/delete/all").as("deleteAll");

    cy.login(ID, PW);

    // Todo 생성
    cy.get("[data-testid=new-todo-input]").type(TEMP_TODO_NAME);
    cy.get("[data-testid=new-todo-add-button]").click();
    cy.contains(TEMP_TODO_NAME).should("exist");
    cy.reload();
    cy.contains(TEMP_TODO_NAME).should("exist");

    cy.get("[data-testid=modify-button]").click();
    cy.get("[data-testid=modify-input]").focus().clear();
    cy.get("[data-testid=modify-input]").type(TEMP_TODO_NEW_NAME);
    cy.get("[data-testid=submit-button]").click();
    cy.contains(TEMP_TODO_NEW_NAME).should("exist");

    cy.reload();
    cy.contains(TEMP_TODO_NEW_NAME).should("exist");

    // Todo 삭제
    cy.get("[data-testid=delete-button]").click();
    cy.get(TEMP_TODO_NEW_NAME).should("not.exist");

    cy.reload();
    cy.get(TEMP_TODO_NEW_NAME).should("not.exist");
  });
});
