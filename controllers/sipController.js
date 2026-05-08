import {createSipFromDB,getSipByIdFromDB,processSipFromDB,getSipTransactionsFromDB} from '../models/sipModel.js';

export const createSip = async (req, res) => {
  const data = await createSipFromDB(req.body);
  return res.json(data);
};

export const oneSipDetails = async (req, res) => {
  const { sid } = req.params;
  const data = await getSipByIdFromDB(sid);
  return res.json({data});
};

export const processSip = async (req, res) => {
  const { sid } = req.params;
  const data = await processSipFromDB(sid);
  return res.json(data);
};

export const sipTransactions = async (req, res) => {
  const { sid } = req.params;
  const data = await getSipTransactionsFromDB(sid);
  return res.json(data);
};