const sql = require("mssql");
const config = require("./Server");

class User {
    constructor(id, email, metric) {
        this.id = id;
        this.email = email;
        this.metric = metric;
    }
}

async function addNewUser(email, metric = 1) {
    try {
        await sql.connect(config);

        const insertResult = await sql.query(`
          INSERT INTO FitnessAppDB.dbo.Users (Email, Metric)
          OUTPUT inserted.UserID, inserted.Email, inserted.Metric
          VALUES ('${email}', ${metric});`);

        const newUser = new User(
            insertResult.recordset[0].Email,
            insertResult.recordset[0].Metric
        );

        // await sql.close();

        return newUser;
    } catch (error) {
        console.error("addNewUser");
    }
};


async function checkUserExists(email) {

    try {
        await sql.connect(config);

        const checkResult = await sql.query(`
        SELECT *
        FROM FitnessAppDB.dbo.Users
        WHERE Email = '${email}';
    `)

        console.log(checkResult.recordset)

        await sql.close()

        return checkResult.recordset.length != 0;
    } catch (no_user) {
        console.error("checkUserExists")

    }
};

async function getUserID(email) {
    try {
        await sql.connect(config);

        const result = await sql.query(
            `select * from FitnessAppDB.dbo.Users where Email = '${email}'`
        );


        const userID = result.recordset[0].UserID;

        // await sql.close();

        return userID;
    } catch (no_user) {
        console.error("getUserID")
        return null

    }
}

async function getUser(user) {
    try {
        await sql.connect(config);

        const result = await sql.query(
            `select * from FitnessAppDB.dbo.Users where 'UserID' = ${user}`
        );

        const users = result.recordset.map((row) => {
            return new User(row.UserID, row.Email, row.Metric);
        });

        // await sql.close();

        return users;
    } catch (error) {
        console.error("");
    }
}

module.exports = {
    getUserID,
    addNewUser,
    checkUserExists,
    getUser
}