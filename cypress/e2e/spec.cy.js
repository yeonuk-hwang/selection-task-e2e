describe("전체 요구사항 확인", () => {
  const API = "https://pre-onboarding-selection-task.shop";

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

  it("메인 화면 방문 성공", () => {
    cy.visit("/");
  });

  it("리다이렉트 /todo -> /signin", () => {
    cy.visit("/todo");
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.url().should("contain", "/signin");
  });

  it("회원가입 및 리다이렉션 성공", () => {
    cy.intercept("POST", /signup/, (req) => {
      req.url = API + "/auth/signup";
    }).as("signup");

    cy.visit("/signup");
    cy.get("[data-testid=email-input]").type(TEMP_ID);
    cy.get("[data-testid=password-input]").type(TEMP_PW);
    cy.get("button").click();
    cy.wait("@signup");
    cy.url().should("contain", "/signin");
  });

  it("회원가입 불가 1 - 이메일 조건 불만족", () => {
    cy.visit("/signup");
    cy.get("[data-testid=email-input]").type(BAD_ID);
    cy.get("[data-testid=password-input]").type(GOOD_PW);
    cy.get("button").should("be.disabled");
  });

  it("회원가입 불가 2 - 비밀번호 조건 불만족", () => {
    cy.visit("/signup");
    cy.get("[data-testid=email-input]").type(GOOD_ID);
    cy.get("[data-testid=password-input]").type(BAD_PW);
    cy.get("[data-testid=signup-button]").should("be.disabled");
    cy.get("button").should("be.disabled");
  });

  it("로그인 불가 1 - 이메일 조건 불만족", () => {
    cy.visit("/signin");
    cy.get("[data-testid=email-input]").type(BAD_ID);
    cy.get("[data-testid=password-input]").type(GOOD_PW);
    cy.get("[data-testid=signin-button]").should("be.disabled");
  });

  it("로그인 불가 2 - 비밀번호 조건 불만족", () => {
    cy.visit("/signin");
    cy.get("[data-testid=email-input]").type(GOOD_ID);
    cy.get("[data-testid=password-input]").type(BAD_PW);
    cy.get("[data-testid=signin-button]").should("be.disabled");
  });

  it("로그인 화면 방문 성공 및 로그인 성공", () => {
    cy.login(ID, PW);
    cy.url().should("contain", "/todo");
  });

  it("리다이렉트 /signup -> /todo", () => {
    cy.login(ID, PW);
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.visit("/signup");
    cy.url().should("contain", "/todo");
  });

  it("리다이렉트 /signin -> /todo", () => {
    cy.login(ID, PW);
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.visit("/signin");
    cy.url().should("contain", "/todo");
  });

  it("로그인 이후 Todo 생성-수정-삭제", () => {
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.intercept("/todos", (req) => {
      console.log("intecept");
      req.url = API + "/todos";
    }).as("todos");

    cy.intercept("/todos/*", (req) => {
      const endpoint = req.url.split("/");
      const id = endpoint[endpoint.length - 1];
      req.url = API + "/todos/" + id;
    }).as("todo");

    cy.login(ID, PW);
    cy.wait("@todos");

    // Todo 생성
    cy.get("[data-testid=new-todo-input]").type(TEMP_TODO_NAME);
    cy.get("[data-testid=new-todo-add-button]").click();
    cy.wait("@todos");
    cy.reload();
    cy.wait("@todos");
    cy.contains(TEMP_TODO_NAME).should("exist");

    cy.get("[data-testid=modify-button]").click();
    cy.get("[data-testid=modify-input]").focus().clear();
    cy.get("[data-testid=modify-input]").type(TEMP_TODO_NEW_NAME);
    cy.get("[data-testid=submit-button]").click();
    cy.wait("@todo");
    cy.contains(TEMP_TODO_NEW_NAME).should("exist");

    cy.reload();
    cy.wait("@todos");
    cy.contains(TEMP_TODO_NEW_NAME).should("exist");

    // Todo 삭제
    cy.get("[data-testid=delete-button]").click();
    cy.wait("@todo");
    cy.get(TEMP_TODO_NEW_NAME).should("not.exist");

    cy.reload();
    cy.wait("@todos");
    cy.get(TEMP_TODO_NEW_NAME).should("not.exist");
  });
});
