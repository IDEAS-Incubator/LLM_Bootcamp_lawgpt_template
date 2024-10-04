import sendMail from '../mail/send.js';
import user from '../helpers/user.js';

import jwt from 'jsonwebtoken';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const notLoggedIn = (req, res) => {
  res.status(405).json({
    status: 405,
    message: "Not Logged",
  });
};

export const signUp = async (req, res) => {
  const Continue = async () => {
    let response = null;
    req.body.pending = true;

    try {
      response = await user.signup(req.body);
    } catch (err) {
      if (err?.exists) {
        res.status(400).json({
          status: 400,
          message: err,
        });
      } else {
        res.status(500).json({
          status: 500,
          message: err,
        });
      }
    } finally {
      if (response?.manual) {
        fs.readFile(
          `${path.resolve(path.dirname(""))}/mail/template.html`,
          "utf8",
          (err, html) => {
            if (!err) {
              html = html.replace(
                "[URL]",
                `${process.env.SITE_URL}:${process.env.SITE_PORT}/signup/pending/${response._id}`
              );
              html = html.replace("[TITLE]", "Verify your email address");
              html = html.replace(
                "[CONTENT]",
                "To continue setting up your LawGPT account, please verify that this is your email address."
              );
              html = html.replace("[BTN_NAME]", "Verify email address");

              sendMail({
                to: req.body.email,
                subject: `LawGPT - Verify your email`,
                html,
              });
            } else {
              sendErrorEmail(err);

              console.log(err);
            }
          }
        );

        res.status(200).json({
          status: 200,
          message: "Success",
          data: {
            _id: null,
            manual: response.manual || false,
          },
        });
      } else if (response) {
        res.status(200).json({
          status: 200,
          message: "Success",
          data: {
            _id: response._id,
            manual: response.manual || false,
          },
        });
      }
    }
  };

  if (req.body?.manual === false) {
    let response = null;
    try {
      response = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${req.body.token}`,
          },
        }
      );
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: err,
      });
    } finally {
      if (response?.data.email_verified) {
        if (req.body?.email === response?.data.email) {
          Continue();
        } else {
          res.status(422).json({
            status: 422,
            message: "Something Wrong",
          });
        }
      }
    }
  } else if (req.body?.email) {
    if (req.body?.pass.length >= 8) {
      req.body.email = req.body.email.toLowerCase();

      Continue();
    } else {
      res.status(422).json({
        status: 422,
        message: "Password must 8 character",
      });
    }
  } else {
    res.status(422).json({
      status: 422,
      message: "Enter email",
    });
  }
};
