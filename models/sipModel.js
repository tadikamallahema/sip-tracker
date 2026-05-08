import Client from '../config/pgManager.js';

export function createSipFromDB(data) {
  return new Promise((resolve, reject) => {
    const {investor_id,portfolio_id,fund_id,sip_amount,sip_date,start_date} = data;
    Client.query(
      `INSERT INTO sips (investor_id,portfolio_id,fund_id,sip_amount,sip_date,start_date,status) 
      VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE')
      RETURNING * ;`,
      [investor_id, portfolio_id, fund_id, sip_amount, sip_date, start_date],
      function (err,res) {
        if (err) reject(err);
        else {
         // console.log(res.rows);
          resolve({"sip": res.rows });
        }
      }
    );
  });
}

export function getSipByIdFromDB(sip_id) {
  return new Promise((resolve, reject) => {
   Client.query(
      `SELECT * FROM sips WHERE sip_id = $1`,
      [sip_id],
      (err, row) => {
        if (err) reject(err);
        else {
          //console.log(row.rows);
          resolve(row.rows);
        }
      }
    );
  });
}

/* export function processSipFromDB(sip_id) {
  return new Promise((resolve, reject) => {
    Client.query(`SELECT * FROM sips WHERE sip_id = $1`, [sip_id], (err, sip) => {
      if (err) return reject(err);
      Client.query(
        `SELECT latest_nav FROM mutual_funds WHERE fund_id = $1`,
        [sip.fund_id],
        (err2, fund) => {
          if (err2) return reject(err2);
          const units = sip.sip_amount / fund.latest_nav;
          Client.query(
            `INSERT INTO investment_transactions
            (sip_id, investor_id, fund_id, nav, amount, units_allocated, transaction_date, transaction_type)
            VALUES ($1, $2, $3, $4, $5, $6, DATE('now'), 'SIP')
            RETURNING *
            `,
            [sip.sip_id,sip.investor_id,sip.fund_id,fund.latest_nav,sip.sip_amount,units],
            function (err,rows) {
              if (err) reject(err);
              else{
                console.log(rows.rows);
                 resolve({ message: 'SIP processed' });
              }
            }
          );
        }
      );
    });
  });
} */

export function processSipFromDB(sip_id) {W
    return new Promise((resolve, reject) => {
        let sipData;
        let fundData;
        Client.query('BEGIN')
        .then(() => {
            return Client.query(
                `SELECT *FROM sipsWHERE sip_id = $1`,[sip_id]
            );
        })
        .then((sipResult) => {
            sipData = sipResult.rows[0];
            return Client.query(
                `SELECT latest_nav FROM mutual_funds WHERE fund_id = $1`,
                [sipData.fund_id]
            );
        })
        .then((fundResult) => {
            fundData = fundResult.rows[0];
            const units =
                sipData.sip_amount / fundData.latest_nav;
            return Client.query(
                `
                INSERT INTO investment_transactions
                (sip_id,investor_id,fund_id,nav,amount,units_allocated,transaction_date,transaction_type)
                VALUES($1, $2, $3, $4, $5, $6, CURRENT_DATE, 'SIP')
                RETURNING *
                `,
                [sipData.sip_id,sipData.investor_id,sipData.fund_id,fundData.latest_nav,sipData.sip_amount,units]
            );
        })
        .then((insertResult) => {
            return Client.query('COMMIT')
            .then(() => {
                resolve({message: "SIP processed successfully",transaction: insertResult.rows[0]});
            });
        })
        .catch((error) => {
            Client.query('ROLLBACK')
            .then(() => {
                console.log(error);
                reject({error: error.message,message: "Transaction failed"});
            });
        });
    });
}
export function getSipTransactionsFromDB(sip_id) {
  return new Promise((resolve, reject) => {
    Client.query(
      `SELECT * FROM investment_transactions WHERE sip_id = $1`,
      [sip_id],
      (err, rows) => {
        if (err) reject(err);
        else {
          //console.log(rows.rows);
          resolve(rows.rows);
        }
      }
    );
  });
}