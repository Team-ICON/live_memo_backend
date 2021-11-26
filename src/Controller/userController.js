export const getUserInfo = (req, res) => {
    let user = req.user;
    return res.status(200).json({ user });
}

export const setFcmToken = async (req, res) => {
    let userId = req.user;
    let fcmToken = req.body.fcmToken; // 확인 필요
    
    await User.findOneAndUpdate({ _id: userId }, { fcmToken: fcmToken}, (err, user) => {
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

