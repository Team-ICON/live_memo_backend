import Memo from "../model/memo";
import User from "../model/user";
import mongoose from "mongoose";

// async await        

export const createMemo = async (req, res) => {
    // 1.유저 아이디 받아오기(유저 데이터에 있는지랑 로그인 여부는 미들웨어에서 통과했다고 생각함)
    // const { userid } = req.body; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    // test용 유저 그냥 해봄
    const userId = mongoose.Types.ObjectId("618df24b47d890818fc96f26");

    // 2. 빈 메모 생성해서 DB에 넣어주기
    const newMemo = {
        content: "",
        userList: [userId],
        userCnt: 1
    }
    await Memo.create(newMemo, (err, newMemo) => {
        if (err) {
            console.log("Err at createMemo");
            console.log(err)
            return res.status(400).json({"message": "memo create err"})
        }
        if (newMemo) {
    // 3. 방금 생성된 메모 id를 해당 유저 DB의 memoList에 추가해주기
            const memoId = newMemo._id;
            // memoList map을 가져온 뒤 수정 --> 다시 저장
            User.findById(userId, (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({"message": "no such id"})
                }

                let memoList = user.memoList;
                if (!memoList) { // memoList 없는 경우(undefined)
                    memoList = new Map();
                }
                memoList.set(memoId, "");   // {생성된 메모id: "폴더 미지정"}
                
                // User DB에 변경사항 다시 저장
                User.findByIdAndUpdate(userId, {memoList: memoList})
                .exec(); // .exec() 써야하는건가??

                return res.status(200).json({ "message": "memo created successfully" });
            });
        }
    })








    // const myFolderList = new Map();
    // myFolderList.set("folder1", ["memo1", "memo2"]);
    // myFolderList.set("folder2", ["memo3", "memo4"]);
    // myFolderList.set("BumBum", ["nene", "chicken"]);
    // console.log(myFolderList);

    // const myMemoList = new Map();
    // myMemoList.set("memo1", "folder1");
    // myMemoList.set("memo2", "folder1");
    // myMemoList.set("memo3", "folder2");
    // myMemoList.set("memo4", "folder2");
    // await User.create({email: "jinh123123@naver.com", folderList: myFolderList, memoList: myMemoList}, (err, memo) => {
    //     if (err) {
    //         console.log("Err at createMemo");
    //         console.log(err)
    //         return res.status(400).json({"message": "memo create err"})
    //     }
    //     if (memo) {
    //         console.log({memo});
    //         return res.status(200).json({ memo })
    //     }
    // })
}

export const updateMemo = (req, res) => {
    
}

export const deleteMemo = (req, res) => {
    
}

export const exportMemo = (req, res) => {
    
}