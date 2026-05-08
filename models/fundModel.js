import  Client  from "../config/pgManager.js";
export function addFundFromDB(data) {
  return new Promise((resolve, reject) => {
    const { amc_id, fund_name, fund_type, category, latest_nav } = data;

    Client.query(
      `INSERT INTO mutual_funds (amc_id, fund_name, fund_type, category, latest_nav)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [amc_id, fund_name, fund_type, category, latest_nav],
      function (err,res) {
        if (err) {
          console.log(err);
          reject({ error: err.message, message: 'Error adding fund' });
        } else {
          resolve({ message: 'Fund added successfully', fund: res.rows });
        }
      }
    );
  });
}

export function getFundsFromDB() {
  return new Promise((resolve, reject) => {
     Client.query(
      `SELECT mf.*, a.amc_name
       FROM mutual_funds mf
       JOIN amcs a ON mf.amc_id = a.amc_id`,
      [],
      (err, rows) => {
        if (err) {
          reject({ error: err.message });
        } else {
          resolve(rows.rows);
        }
      }
    );
  });
}
export function updateFundNAVFromDB(fundId, latest_nav) {
  return new Promise((resolve, reject) => {
     Client.query(
      `UPDATE mutual_funds
       SET latest_nav = $1, updated_at = CURRENT_TIMESTAMP
       WHERE fund_id = $2`,
      [latest_nav, fundId],
      function (err) {
        if (err) {
          reject({ error: err.message });
        } else {
          //console.log(latest_nav+" "+fundId);
          resolve({ message: 'NAV updated' });
        }
      }
    );
  });
}