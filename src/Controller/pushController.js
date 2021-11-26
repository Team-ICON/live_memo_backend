import Memo from "../model/memo";
import User from "../model/user";


export const fcmTokenList = (req, res) => { 
    const memoId = req.body.memoId
    const userId = req.user._id

    Memo.findOne({ "_id": memoId }, (err, memo) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "err" });
        }

        if (!memo) {
            console.log("no such memo!");
            return res.status(400).json({ "message": "no such memo!" });
        }

        const userList = memo.userList || [];
        const fcmTokenList = [];


        User.find({ _id: { $in: userList }}, function (err, users) {
            users.forEach(user => {
                if (user._id !== userId) {
                    fcmTokenList.push(user.fcmToken);
                }
            });
            return res.status(200).json({ success: true, fcmTokenList });
        });
    })
}

