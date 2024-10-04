import { db } from "../db/connection.js";
import collections from "../db/collections.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { sendErrorEmail } from "../mail/send.js";

export default {
  signup: ({ email, pass, inviteCode, manual, pending }) => {
    return new Promise(async (resolve, reject) => {
      let done = null;

      let userId = new ObjectId().toHexString();

      try {
        let check = await db.collection(collections.USER).findOne({
          email: email,
        });
        // const invitationDocument = await db
        //   .collection(collections.INVITATION)
        //   .findOne({
        //     codes: inviteCode,
        //   });

        // if (!invitationDocument) {
        //   reject({ message: `Code ${inviteCode} not found.` });
        //   return;
        // }
        if (!check) {
          pass = await bcrypt.hash(pass, 10);

          await db
            .collection(collections.TEMP)
            .createIndex({ email: 1 }, { unique: true });
          await db
            .collection(collections.TEMP)
            .createIndex({ expireAt: 1 }, { expireAfterSeconds: 3600 });
          done = await db.collection(collections.TEMP).insertOne({
            _id: new ObjectId(userId),
            userId: `${userId}_register`,
            email: `${email}_register`,
            // inviteCode: inviteCode,
            register: true,
            pass: pass,
            manual: manual,
            pending: pending,
            expireAt: new Date(),
          });
        }
      } catch (err) {
        if (err?.code === 11000) {
          done = await db
            .collection(collections.TEMP)
            .findOneAndUpdate(
              {
                email: `${email}_register`,
                register: true,
              },
              {
                $set: {
                  pass: pass,
                  manual: manual,
                },
              }
            )
            .catch((err) => {
              reject(err);
            });
        } else if (err?.code === 85) {
          done = await db
            .collection(collections.TEMP)
            .insertOne({
              _id: new ObjectId(userId),
              userId: `${userId}_register`,
              email: `${email}_register`,
              pass: pass,
              manual: manual,
              pending: pending,
              expireAt: new Date(),
            })
            .catch(async (err) => {
              if (err?.code === 11000) {
                done = await db
                  .collection(collections.TEMP)
                  .findOneAndUpdate(
                    {
                      email: `${email}_register`,
                      register: true,
                    },
                    {
                      $set: {
                        pass: pass,
                        manual: manual,
                      },
                    }
                  )
                  .catch((err) => {
                    reject(err);
                  });
              } else {
                reject(err);
              }
            });
        } else {
          reject(err);
        }
      } finally {
        if (done?.value) {
          resolve({ _id: done?.value?._id.toString(), manual });
        } else if (done?.insertedId) {
          resolve({ _id: done?.insertedId?.toString(), manual });
        } else {
          reject({ exists: true, text: "Email already used" });
        }
      }
    });
  },
};
