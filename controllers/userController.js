const express = require("express");
const pool = require("../helpers/database");
const fs = require("fs").promises;
// const { table, error } = require('console');
// const { use } = require('../routes/userRoute');
const filePath = "./helpers/user.sql";
let tableCreated = false;

const createUser = async (req, res) => {
  try {
    const { UserID, Username, Password, UserType } = req.body;
    if (!UserID || !Username || !Password) {
      return res
        .status(400)
        .json({ error: "Please provide all mandatory fields" });
    }
    if (!tableCreated) {
      const createTableQuery = await fs.readFile(filePath, "utf-8");
      await pool.query(createTableQuery);
      tableCreated = true;
    }
    const insertQuery =
      "INSERT INTO users (UserID,Username,Password,UserType) VALUES (?,?,?,?)";
    const result = await pool.query(insertQuery, [
      UserID,
      Username,
      Password,
      UserType,
    ]);
    console.log(result);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log("Error in createUser:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserByID = async (req, res) => {
  try {
    const id = req.params.userId;
    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ error: "Please provide user id in string" });
    }
    console.log("User Id", id);
    const sqlQuery = "SELECT * from users where UserID= ?";
    const [rows, fields] = await pool.query(sqlQuery, [id]);
    console.log("Rows:", rows);
    if (rows.length === 0) {
      return res.status(404).json({ error: "USER NOT FOUND" });
    }
    res.json({
      user: rows,
    });
  } catch (error) {
    console.log("Error in getUserById", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { Username, Password, UserType } = req.body;
    if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "Invalid User ID" });
      }

   
    const updateQuery =
      "UPDATE users SET Username=?, Password=?, UserType=? where UserID=?";
    const result = await pool.query(updateQuery, [
      Username,
      Password,
      UserType,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User Not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log("Error in updateUser", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const deleteQuery = "DELETE FROM users where UserID=?";
    const result = await pool.query(deleteQuery, [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "User NOT FOUND",
      });
    }
    res.status(200).json({
      message: "User deleted Successfully",
    });
  } catch (error) {
    console.log("Error in deleteuser", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  getUserByID,
  updateUser,
  deleteUser,
};
