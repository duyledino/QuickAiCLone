import "dotenv/config";
import QueryString from "qs";
import crypto from "node:crypto";
import dayjs from "dayjs";

const createPaymentUrl = (req,amount,returnURL,vnp_TxnRef,OrderInfo) => {
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
  vnp_Params["vnp_TxnRef"] = vnp_TxnRef;
  vnp_Params["vnp_OrderInfo"] = OrderInfo;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnURL;
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
  return vnpUrl;
};

// transaction response
// {
//   vnp_Amount: '10000000',
//   vnp_BankCode: 'NCB',
//   vnp_BankTranNo: 'VNP15079080',
//   vnp_CardType: 'ATM',
//   vnp_OrderInfo: 'Thanh toan cho ma GD:6b0a2e7c-a',
//   vnp_PayDate: '20250716181728',
//   vnp_ResponseCode: '00',
//   vnp_TmnCode: 'OM89333P',
//   vnp_TransactionNo: '15079080',
//   vnp_TransactionStatus: '00',
//   vnp_TxnRef: '6b0a2e7c-a',
//   vnp_SecureHash: '9e0f23379e840998909aa77cd5211a521ec9b8aa0aa3d6cd0ac05fe5fed8eeac9075f9ca8b5f4889c0272efcae868b35d48af8cb87903bc3f904a7b75ca1db5d'
// }

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

export {createPaymentUrl};
