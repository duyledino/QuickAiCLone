import pool from "../config/db.js";
import { v4 as uuid } from "uuid";
import "dotenv/config";
import { createPaymentUrl } from "../config/vnpay.js";

const getCreationsById = async (req, res) => {
  const { user_id } = req.query;
  console.log("user_id here:", user_id);
  const row = await pool.query(
    "select * from creations where user_id = $1 order by create_at asc",
    [user_id]
  );
  return res.status(200).json({ creations: row.rows });
};

const getCommunity = async (req, res) => {
  console.log("in community");
  try {
    const row = await pool.query(
      `select * from creations where publish = TRUE order by update_at asc `
    );
    return res.status(200).json({ community: row.rows });
  } catch (error) {
    return res.status(400).json({ Message: error });
  }
};

const LikeCreation = async (req, res) => {
  try {
    const { user } = req;
    const { creation_id } = req.query;
    const { likes } = req.body;
    console.log("all like of this creation: ", creation_id, likes);
    const row = await pool.query(
      `update creations set likes = $1 where creation_id = $2`,
      [likes, creation_id]
    );
    if (likes.find((e) => e === user.user_id)) {
      return res.status(200).json({ Message: "You liked this community !" });
    }
    return res.status(200).json({ Message: "" });
  } catch (error) {
    return res.status.json({ Message: error });
  }
};

const upgradePlan = async (req, res) => {
  const { user } = req;
  const { amount } = req.body;
  const planId = uuid();
  console.log(process.env.ReturnRoute);
  try {
    const paymentURL = createPaymentUrl(req,amount,`${process.env.ReturnRoute}?user_id=${user.user_id}`,`${user.user_id}+${planId}`,`Thanh toán đơn hàng ${planId}`)
    return res
      .status(200)
      .json({ PaymentURL: paymentURL, user_id: user.user_id });
  } catch (error) {
    console.error(error);
  }
};

const paymentResult = async (req, res) => {
  const verify = vnpay.verifyReturnUrl(req.query);

  if (verify.isSuccess) {
    console.log("✅ Thanh toán thành công!", verify.message);
    console.log(verify);
    const data = await pool.query(
      `update users set user_plan = $1 where user_id = $2`,
      ["Premium", verify.vnp_TxnRef]
    );
  } else {
    console.log("❌ Thanh toán thất bại:", verify.message);
  }
  return res.status(200).json(verify.message);
};

const paymentStatus = async (req, res) => {
  const { user_id } = req.query;
  try {
    const data = await pool.query(
      `update users set user_plan = $1 where user_id = $2`,
      ["Premium", user_id]
    );
    return res.status(200).json({
      Message: "Transaction completed. Pay successfully !",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ Message: error });
  }
};

const getUserInfo = async(req,res)=>{
  const {user_id} = req.query;
  console.log("userid in getUserInfo", user_id);
  try {
    const data = await pool.query(`select * from users where user_id = $1`,[user_id]);
    console.log("data in getUserInfo",data.rows[0]);
    return res.status(200).json({user: data.rows[0]});
  } catch (error) {
    console.log(error);
    return res.status(400).json({ Message: error });
  }
}

export {
  getUserInfo,
  getCreationsById,
  getCommunity,
  LikeCreation,
  upgradePlan,
  paymentResult,
  paymentStatus,
};
