//import db from "../config/db.js";
import client from "../config/pgManager.js";

export function addInvestorFromDB(data) {
    return new Promise((resolve, reject) => {
        const {first_name,last_name,email,phone,pan_number} = data;
        client.query(
            `
            INSERT INTO investors (first_name,last_name,email,phone,pan_number)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [first_name, last_name, email, phone, pan_number]
        )
        .then((result) => {
            //console.log(result.rows[0]);
            //console.log(result.rows);
            resolve({message: "Investor added successfully",investor: result.rows[0]});})
        .catch((error) => {
            reject({error: error.message,message: "Error adding investor"});
        });
    });
}

export function getAllInvestorsFromDB() {
    return new Promise((resolve, reject) => {
        client.query(
            `SELECT * FROM investors ORDER BY investor_id  `,[],
            /* (err, rows) => {
                if(err) {
                    reject({error: err.message,message: 'Error fetching investors'});
                } else {
                    resolve(rows);
                }
            } */
        ).then((res)=>{
            resolve(res.rows);
        }).catch((err)=>{
            reject(err)
        })
    });
}

export function getAInvestorFromDB(id) {
    return new Promise((resolve, reject) => {
        client.query(
            `SELECT * FROM investors WHERE investor_id = $1 ;`,[id],
            (err, row) => {
                if(err) {
                    //console.log(err);
                    reject({error: err.message,message: 'Error fetching investor'});
                } else {
                    //console.log(row)
                    resolve(row.rows);
                }
          }
        );
    });
}
export function investorHoldingsFromDB(id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT mf.fund_id,mf.fund_name,
                ROUND(COALESCE(SUM(it.units_allocated), 0),4) AS total_units,
                COALESCE(mf.latest_nav, 0) AS latest_nav,
                ROUND(
                    COALESCE(SUM(it.units_allocated), 0) *
                    COALESCE(mf.latest_nav, 0),2) AS current_value
                    FROM investment_transactions it
            JOIN mutual_funds mf
            ON it.fund_id = mf.fund_id
            WHERE it.investor_id = $1
            GROUP BY mf.fund_id, mf.fund_name
        `;
        client.query(query, [id], (err, res) => {
            if (err) {
                reject({error: err.message,message: "Error fetching holdings"});
            } else {
               resolve(res.rows);
            }
        });
    });
}

export function totalInvestmentOfUserFromDB(id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT i.investor_id,i.first_name,i.last_name,
                ROUND(
                    COALESCE(
                        SUM(
                            COALESCE(it.units_allocated, 0) *
                            COALESCE(mf.latest_nav, 0)),0),2) AS net_worth
            FROM investors i
            LEFT JOIN investment_transactions it
            ON i.investor_id = it.investor_id
            LEFT JOIN mutual_funds mf
            ON it.fund_id = mf.fund_id
            WHERE i.investor_id = $1
            GROUP BY i.investor_id,i.first_name,i.last_name
        `;
        client.query(query, [id], (err, res) => {
            if (err) {
                reject({error: err.message,message: "Error calculating net worth"});
            } else {
                resolve(res.rows);
            }
        });
    });
}

const users=[
    {email:'hema@gmail.com',
        password:"hema",
        role:"user",
        loggedIn:false,
    }
]

export function loginUser(email,password){
    const userIndex=users.findIndex((u)=>u.email==email && u.password==password);
    if(userIndex!=-1){
        users[userIndex]={...users[userIndex],loggedIn:true};
    }
    return users[userIndex];
}

export const invalidToken=[];

export function logoutUser(email, token){
    const userIndex = users.findIndex(
        (u)=> u.email == email && u.loggedIn == true
    );
    if (userIndex != -1){
        users[userIndex] = {...users[userIndex], loggedIn:false};
        invalidToken.push(token);
        return true;
    }
    return false;
}