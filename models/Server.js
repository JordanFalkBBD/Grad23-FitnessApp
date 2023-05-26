const config = {
  user: "root",
  password: "FitnessApp",
  server: "mssqldb.cjovnczdjuek.eu-west-1.rds.amazonaws.com",
  database: "FitnessAppDB",
  trustServerCertificate: true,
  pool: {min: 5}
};

module.exports = config;