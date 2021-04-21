///<reference types="cypress" />

describe("SignUp", () => {
    let randomString = Math.random().toString(36).substring(2);
    let username = "zeljko" + randomString;
    let email = "zeljko"+ randomString + "@gmail.com";
    let password = "abcd1234";

    it("Test valid sign up", () => {
        cy.server();
        cy.route("POST", "**/users").as("newUser");

        cy.visit("http://localhost:4200/");
        cy.get(".nav-link").contains("Sign up").click();
        cy.get("[placeholder='Username']").type(username);
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(password);
        cy.get("button").contains("Sign up").click();

        cy.wait("@newUser");
        cy.get("@newUser").should((xhrObj) => {
            expect(xhrObj.status).to.eq(200);
            expect(xhrObj.request.body.user.username).to.eq(username);
            expect(xhrObj.request.body.user.email).to.eq(email);
            
        });
         

    });

    it("Test valid login", () => {
        cy.server();
        cy.route("GET", "**/tags", "fixture:popularTags.json");

        cy.visit("http://localhost:4200/");
        cy.get(".nav-link").contains("Sign in").click();
        
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(password);
        cy.get("button").contains("Sign in").click();
        cy.get(':nth-child(4) > .nav-link').should('be.visible');

        cy.get('.tag-list').should('contain', "automation-testing").and('contain', "nodejs");
    })

    it("Mock global feed data", () => {
        cy.server();
        cy.route("GET", "**/articles/*", "fixture:testArticles.json").as("articles");

        cy.visit("http://localhost:4200/");
        cy.get(".nav-link").contains("Sign in").click();
        
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(password);
        cy.get("button").contains("Sign in").click();

        cy.get("@articles");
        

    })
});