

import { signJwt } from "../config/authManager.js";
import {addInvestorFromDB,getAllInvestorsFromDB,getAInvestorFromDB,investorHoldingsFromDB,totalInvestmentOfUserFromDB, loginUser, logoutUser} from "../models/investorModels.js";

export const createInvestor = async(req, res) => {
    try {
        const investor = await addInvestorFromDB(req.body);
        return res.status(201).json({investor});
    } catch(err) {
        return res.status(500).json(err);
    }
};

export const getAllInvestors = async(req, res) => {
    try {
        const investors = await getAllInvestorsFromDB();
        return res.status(200).json(investors);
    } catch(err) {
        return res.status(500).json(err);
    }
};

export const getAInvestor = async(req, res) => {
    try {
        const investor = await getAInvestorFromDB(req.params.id);
        if(!investor) {
            return res.status(404).json({
                message: 'Investor not found'
            });
        }
        return res.status(200).json(investor);
    } catch(err) {
        return res.status(500).json(err);
    }
};

export const investorHoldings = async(req, res) => {
    try {
        const holdings = await investorHoldingsFromDB(req.params.id);
        //console.log(holdings);
        return res.status(200).json(holdings);
    } catch(err) {
        return res.status(500).json(err);
    }
};
export const totalInvestmentOfUser = async(req, res) => {
    try {
        const networth = await totalInvestmentOfUserFromDB(req.params.id);
        //console.log(networth);
        return res.status(200).json(networth);
    } catch(err) {
        return res.status(500).json(err);
    }
};


export const login=(request,response)=>{
    const {email,password}=request.body;
    //const user=loginUser(email,password);
    const token=signJwt({email:user.email,role:user.role})
    return response.json({token:token});
}
export const invalidToken = [];

export const logout=(request,response)=>{
    const {email,token}=request.body;
    const result=logoutUser(email,token);
    return response.status(200).json({message:"User logged out"});
}
