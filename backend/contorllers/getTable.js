const { Client } = require("pg");
console.log(process.env.DATABASE_URL)
const client = new Client({
        connectionString: process.env.DATABASE_URL || "postgres://izvfesfr:gkrKGIO0gzYcHmNWlor8yZNRlL3XCqnG@abul.db.elephantsql.com/izvfesfr",
        ssl: {
            rejectUnauthorized: false,
        }
      })

client.connect();
function getTable(req, res) {
    client.query(
        `SELECT date,name,amount,distance FROM ${process.env.TABLE_NAME || "table_with_data"}`,
        (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).end();
            } else {
                const table = data.rows.map((row)=>Object.values(row));
                const columns = [
                    {colType:"date", name:"date", text: "Дата"},
                    {colType:"string", name:"name", text: "Название", filters:[{name:"has", text:"содержит"}]},
                    {colType:"number", name:"amount", text: "Количество", filters:[{name:"equal", text:"равно"},{name:"more", text:"больше"},{name:"less", text:"меньше"}]},
                    {colType:"number", name:"distance", text: "Расстояние", filters:[{name:"equal", text:"равно"},{name:"more", text:"больше"},{name:"less", text:"меньше"}]}];
                res.send(JSON.stringify({columns, table})).end();
            }
        }
        );
}

module.exports=getTable