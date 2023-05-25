var sql = require("mssql");

var config = {
    user: "root",
    password: "FitnessApp",
    server: "mssqldb.cjovnczdjuek.eu-west-1.rds.amazonaws.com",
    database: "FitnessAppDB",
};
trustServerCertificate: true,

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
          INSERT INTO User (Email, Metric)
          OUTPUT inserted.UserID, inserted.Email, inserted.Metric
          VALUES ('${email}', ${metric});`);

        const newUser = new User(
            insertResult.recordset[0].Email,
            insertResult.recordset[0].Metric
        );

        await sql.close();

        return newUser;
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
};

async function checkUserExists(email) {
    try {
        await sql.connect(config);

        const checkResult = await sql.query(`
        SELECT COUNT(*) AS [Count]
        FROM FitnessAppDB.dbo.Users
        WHERE Email = ${email};
    `)

        await sql.close()

        return checkResult > 0;
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
};

async function getUserID(email) {
    try {
        await sql.connect(config);

        const result = await sql.query(
            `select UserID from Users where Email = '${email}'`
        );

        const userID = result.recordset[0].UserID;

        await sql.close();

        return userID;
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}

async function getUser(user) {
    try {
        await sql.connect(config);

        const result = await sql.query(
            `select UserID, Email, Metric from Users where UserID = ${user}`
        );

        const users = result.recordset.map((row) => {
            return new User(row.UserID, row.Email, row.Metric);
        });

        await sql.close();

        return users;
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}

module.exports = {
    getUserID,
    addNewUser,
    checkUserExists,
    getUser
}