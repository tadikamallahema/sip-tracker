import {addFundFromDB,getFundsFromDB,updateFundNAVFromDB} from '../models/fundModel.js';

export const createFund = async (req, res) => {
    try {
        const fund = await addFundFromDB(req.body);
        //console.log(fund);
        return res.status(201).json(fund);
    } catch (err) {
      console.log(err);
        return res.status(500).json(err);
    }
};

export const getFunds = async (req, res) => {
  const funds = await getFundsFromDB();
  return res.json(funds);
};

export const updateFundNAV = async (req, res) => {
  const { fundId } = req.params;
  //console.log(req.body);
  const { latest_nav } = req.body;
  //console.log(fundId+" "+latest_nav);
  const result = await updateFundNAVFromDB(fundId, latest_nav);
  return res.json(result);
};