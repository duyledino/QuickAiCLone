import pool from "../config/db.js";
import { v4 as uuid } from "uuid";
import "dotenv/config";
import QueryString from "qs";
import crypto from "node:crypto";
import dayjs from "dayjs";

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
  try {
    console.log(
      "ENV:",
      process.env.vnp_Url,
      process.env.vnp_TmnCode,
      process.env.vnp_HashSecret
    );
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    const createDate = dayjs().format("YYYYMMDDHHmmss");
    let currCode = "VND";
    let vnp_Params = {};
    let vnpUrl = process.env.vnp_Url;
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = `${process.env.vnp_TmnCode}`;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = `${planId}`;
    vnp_Params["vnp_OrderInfo"] = `Thanh toán đơn hàng ${planId}`;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params[
      "vnp_ReturnUrl"
    ] = `${process.env.ReturnRoute}?user_id=${user.user_id}`;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    vnp_Params["vnp_BankCode"] = "NCB"; // cannot use QRCODE because of testing only
    vnp_Params = sortObject(vnp_Params);
    const signData = QueryString.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", `${process.env.vnp_HashSecret}`);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    console.log(signed);
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + QueryString.stringify(vnp_Params, { encode: false });
    console.log(vnp_Params);
    console.log(vnpUrl);
    return res
      .status(200)
      .json({ PaymentURL: vnpUrl, user_id: user.user_id });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ Message: "Please generate at least 1 creation for continuous" });
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

const getUserInfo = async (req, res) => {
  const { user_id } = req.query;
  console.log("userid in getUserInfo", user_id);
  try {
    const data = await pool.query(`select * from users where user_id = $1`, [
      user_id,
    ]);
    console.log("data in getUserInfo", data.rows[0]);
    return res.status(200).json({ user: data.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ Message: error });
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
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
