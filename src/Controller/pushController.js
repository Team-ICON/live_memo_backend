import Memo from "../model/memo";
import User from "../model/user";
import Push from "../model/push";


export const createPush = (req, res) => { 
    // 1. 리퀘스트로부터 보내는 유저ID, 받는 유저리스트, push 할 내용 받아오기
    // const { userid } = req.body; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    // test용 유저 그냥 해봄
    const user = req.user;

    // 2. 해당 유저 데이터에서 받아오기
    User.findOne({ ID: user.ID }, async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "no such id" })
        }

        let folderList = user.folderList;
        // 이미 존재하는 폴더인 경우, 에러 처리
        if (folderList.has(folderName)) {
            // console.log("already existing folder");
            return res.status(400).json({ "message": "already existing folder" })
        }
        // 폴더 리스트에 폴더명 추가해주기
        folderList.set(folderName, []);
        // console.log(folderList);

        // 3. DB에 {folderList: folderList} 반영하기
        await User.findOneAndUpdate({ ID: user.ID }, { folderList: folderList });
        return res.status(200).json({ success: true, folders: folderList });
    });
}
