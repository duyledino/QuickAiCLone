import { clerkClient, getAuth } from "@clerk/express";
import pool from "../config/db.js";

export const auth = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    console.log(userId);
    let user = await pool.query(`select * from users where user_id = $1`, [
      userId,
    ]);
    if (!userId)
      return res.status(200).json({ Message: "No token or token expire" });
    if (user.rowCount === 0) {
      const userClerk = await clerkClient.users.getUser(userId);
      user = await pool.query(
        "insert into users(user_id,user_gmail,user_name) values($1,$2,$3) returnings *",
        [
          userId,
          userClerk.emailAddresses[0].emailAddress,
          `${userClerk.firstName} ${userClerk.lastName}`,
        ]
      );
    }
    const { user_plan, free_usage } = user.rows[0];
    if (user_plan === "Free") {
      if (
        req.path.includes("image_generator") ||
        req.path.includes("background_removal") ||
        req.path.includes("resume_reviewer")
      ) {
        return res
          .status(400)
          .json({ Message: "Update to Pro for unlimited access" });
      }
      if (free_usage === 0) {
        return res.status(400).json({ Message: "Reach limit usage." });
      } else {
        user = await pool.query(
          "update users set free_usage = free_usage - 1 where user_id = $1 returning *",
          [userId]
        );
      }
    }
    console.log(user.rows);
    req.user = user.rows[0];
    next();
  } catch (error) {
    console.error(error);
  }
};

export const userAuth = async (req, res, next) => {
  const { userId } = req.auth();
  if (!userId)
    return res.status(200).json({ Message: "No token or token expire" });
  let user = await pool.query(`select * from users where user_id = $1`, [
    userId,
  ]);
  req.user = user.rows[0]
  next();
};
