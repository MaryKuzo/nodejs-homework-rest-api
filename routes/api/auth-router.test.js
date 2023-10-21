import mongoose from "mongoose";
import request from "supertest";

import app from '../../app.js';
import User from "../../models/User.js";

const { TEST_DB_HOST, PORT = 3000 } = process.env;

describe("test signin route", () => {
    let server = null;
    beforeAll(async () => {
        await mongoose.connect(TEST_DB_HOST);
        server = app.listen(PORT);
    });

    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    test("test signin with correct data", async () => {
        const signupData = {
            username: "Mary",
            email: "mary12@mail.com",
            password: "1234567",
        };

        
        await request(app).post("/api/auth/signup").send(signupData);

        const signinData = {
            email: "mary12@mail.com",
            password: "1234567",
        };

        const { statusCode, body } = await request(app).post("/api/auth/signin").send(signinData);
        expect(statusCode).toBe(200); 
        expect(body.token).toBeTruthy(); 
        

        const user = await User.findOne({ email: signinData.email });
        expect(user).toBeTruthy(); 
        expect(user.email).toBe(signinData.email); 
        expect(user.username).toBe(signupData.username); 
        expect(typeof user.email).toBe("string"); 
        expect(typeof user.token).toBe("string"); 
    });
});
