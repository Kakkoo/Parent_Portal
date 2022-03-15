const express = require("express");
const Kid = require("../../models/Kid");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const mongoose = require("mongoose");
const validateRegisterkidInput = require("../../validation/registerkid");
const validateAssignWorkInput = require("../../validation/assignwork");
const Work = require("../../models/Work");
const router = express.Router();
// @route POST /api/kids
// @desc Register a kid for a particular user
// @access Private

router.post(
  "/registerkid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log('req: ', req.body);
    // console.log('res: ', res);
    const { errors, isValid } = validateRegisterkidInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const kiddata = new Kid({
      user: req.user._id,
      name: req.body.name,
      age: req.body.age,
    });

    Kid.findOne({ name: req.body.name, user: req.user._id })
      .then((kid) => {
        console.log("user: ", kid);
        if (kid) {
          return res.status(400).json({ name: "name already exist" });
        } else {
          kiddata
            .save()
            .then((kid) => res.json(kid))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }
);
// @route POST /api/kids
// @desc delete a kid name all of his/her works for a particular user
// @access Private

router.post(
  "/deletekid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log('req: ', req.body);
    // console.log('res: ', res);
    // const { errors, isValid } = validateRegisterkidInput(req.body);
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    Kid.findOne({ name: req.body.removename, user: req.user._id })
      .then((kid) => {
        console.log("user: ", kid);
        if (kid) {
          Kid.deleteOne({ user: req.user._id, name: req.body.removename })
            .then((data) => {
              res.json(data);
            })
            .catch((err) => console.log(err));
          Work.deleteMany({ user: req.user._id, name: req.body.removename })
            .then((data) => {
              res.json(data);
            })
            .catch((err) => console.log(err));
          return res.status(400).json({ name: "name deleted." });
        } else {
          return res.status(400).json({ name: "Nmae does't exists." });
        }
      })
      .catch((err) => console.log(err));
  }
);
router.get(
  "/getkid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Kid.find({ user: req.user._id })
      .then((kid) => {
        console.log("Kids_server: ", kid);
        let KIDS = kid.map((item) => item.name);
        if (kid) {
          return res.status(200).json(KIDS);
        } else {
          console.log("no kids");
        }
      })
      .catch((err) => console.log(err));
  }
);

// @route POST /api/kids
// @desc assign work to kid
// @access Private

router.post(
  "/assignwork",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log('req: ', req.body);
    // console.log('res: ', res);
    const { errors, isValid } = validateAssignWorkInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Work.findOne({
      user: req.user._id,
      name: req.body.name,
      work: req.body.work,
      money: req.body.money,
    })
      .then((data) => {
        if (data) {
          return res
            .status(404)
            .json({ work: "Same work is aleady assigned." });
        }
        const newWork = new Work({
          user: req.user._id,
          name: req.body.name,
          work: req.body.work,
          money: req.body.money,
        });
        newWork
          .save()
          .then((work) => res.json(work))
          .catch((err) => console.log(err));
        console.log("work added");
      })
      .catch((err) => console.log(err));
  }
);
// @route POST /api/kids
// @desc assigned to done
// @access Private

router.post(
  "/assignedtodone",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const name = req.body.name;
    const work = req.body.work;
    const money = req.body.money;
    const user = req.user._id;

    Work.findOne({ name: name, work: work, money: money, user: user })
      .then((kid) => {
        if (!kid) {
          return res.status(404).json({ name: "Kid not found" });
        }
        const ID = kid._id;
        Work.updateOne({ _id: ID }, { $set: { status: "done" } })
          .then((kid) => {
            res.json(kid);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);
// @route POST /api/kids
// @desc assigned work
// @access Private

router.get(
  "/assignedwork",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = req.user._id;

    Work.find({ user: user, status: "assigned" })
      .then((work) => {
        if (!work) {
          return res.status(200).json({ name: "No work is assigned yet" });
        } else {
          Kid.find({ user: user }).then((Kids) => {
            let array = [];
            let RESULT = [];
            let result = {};
            if (!Kids) {
              return res
                .status(400)
                .json({ Kid: "No Kids found for this user" });
            } else {
              for (let i = 0; i < Kids.length; i++) {
                result = {};
                RESULT = [];
                result.key = i;
                result.value = Kids[i].name;
                for (let j = 0; j < work.length; j++) {
                  if (Kids[i].name === work[j].name) {
                    //RESULT[work[j]._id] = work[j].work;
                    RESULT.push(work[j].work);
                    RESULT.push(work[j].money);
                  }
                }
                result.work = RESULT;
                array.push(result);
              }
              return res.status(200).json(array);
            }
          });
        }
      })
      .catch((err) => console.log(err));
  }
);
// @route GET /api/kids
// @desc earned money by kids
// @access Private

router.get(
  "/earned",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const USER = req.user._id;
    Kid.find({ user: USER })
      .populate("Kid", ["name"])
      .then((KID) => {
        if (!KID) {
          console.log("no kids");
        }

        var Kids = [];
        let i = 0;
        for (i = 0; i < KID.length; i++) {
          Kids.push(KID[i].name);
        }
        console.log("KIDS:", Kids);

        Work.find({ user: USER, status: "done" })
          .then((data) => {
            let total = 0;
            let balance = [];
            let temp = {};
            let i = 0;
            for (i = 0; i < Kids.length; i++) {
              total = 0;
              temp = {};
              for (let j = 0; j < data.length; j++) {
                if (data[j].name === Kids[i]) {
                  total = total + Number(data[j].money);
                }
              }
              temp.key = i;
              temp.name = Kids[i];
              temp.money = total;
              balance.push({ key: i, value: temp });
            }
            console.log(balance);
            return res.json(balance);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);
// @route DELETE /api/kids
// @desc DELETE status: done data for a given kid
// @access Private

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const KID = req.body.name;
    const USER = req.user._id;
    Work.deleteMany({ user: USER, name: KID, status: "done" })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err));
  }
);
module.exports = router;
