import { expect } from "chai";
import { initializeTestDb, insertTestUser, getToken } from "./helper/test.js";

describe("Testing basic database functionality", () => {
    let token = null
    const testUser = { email: "foo@foo.com", password: "password123" }
    
    before(() => {
        initializeTestDb()
        token = getToken(testUser.email)
    })
    
    it("should get all tasks", async () => {
        const response = await fetch("http://localhost:3001/");
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.be.an("array").that.is.not.empty;
        expect(data[0]).to.include.all.keys("id", "description");
    })

    it("should create a new task", async () => {
        const newTask = { description: "Test task" };
        const response = await fetch("http://localhost:3001/create", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({ task: newTask })
        })
        const data = await response.json();
        expect(response.status).to.equal(201);
        expect(data).to.include.all.keys(["id", "description"]);
        expect(data.description).to.equal(newTask.description);
    })

    it("should delete task", async () => {
        const response = await fetch("http://localhost:3001/delete/1", {
            method: "delete",
            headers: {
                Authorization: token
            }
        });
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.include.all.keys(["id"]);
    })

    it("should not create a new task without description", async () => {
        const response = await fetch("http://localhost:3001/create", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: null })
        });
        const data = await response.json();
        expect(response.status).to.equal(401);
        expect(data).to.include.all.keys("message");
    });
})

describe("Testing user management", () => {
    const user = { email: "foo2@test.com", password: "password123" }
    
    before(() => {
        insertTestUser(user)
    })
    
    it("should sign up", async () => {
        const newUser = { email: "foo@test.com", password: "password123" }
        const response = await fetch("http://localhost:3001/user/signup", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: newUser })
        })
        const data = await response.json()
        if (response.status !== 201) {
            console.error("Error from server:", data.error)
        }
        expect(response.status).to.equal(201)
        expect(data).to.include.all.keys(["id", "email"])
        expect(data.email).to.equal(newUser.email)
    })
    
    it('should log in', async () => {
        const response = await fetch("http://localhost:3001/user/signin", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user })
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.include.all.keys(["id", "email", "token"])
        expect(data.email).to.equal(user.email)
    })
})
