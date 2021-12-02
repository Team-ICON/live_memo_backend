import User from "../model/user";

export const getUserInfo = (req, res) => {
    const { _id } = req.user;
    User.findOne({ _id: _id }).exec((err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "err at showMemo" })
        }

        return res.status(200).json({ user });
    })
}

export const setFcmToken = (req, res) => {
    let userId = req.user;
    let fcmToken = req.body.fcmToken;

    User.findOneAndUpdate({ _id: userId }, { fcmToken: fcmToken }, (err, user) => {
        if (err) {
            console.log("error find ID");
            console.error(err);
            return res.status(400).json({ "message": "err.message" });
        }

        if (!user) {
            console.log("no such id");
            return res.status(400).json({ "message": "no such id" })
        }
        return res.status(200).json({ "message": "set fcmToken successfully" });
    })
}

