import Memo from "../model/memo";
import User from "../model/user";

// async await        

export const createMemo = async (req, res) => {
    // const { userid } = req.body; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    // console.log("userid is", userid);
    const myFolderList = new Map();
    myFolderList.set("folder1", ["memo1", "memo2"]);
    myFolderList.set("folder2", ["memo3", "memo4"]);
    myFolderList.set("BumBum", ["nene", "chicken"]);
    console.log(myFolderList);

    const myMemoList = new Map();
    myMemoList.set("memo1", "folder1");
    myMemoList.set("memo2", "folder1");
    myMemoList.set("memo3", "folder2");
    myMemoList.set("memo4", "folder2");
    await User.create({email: "jinh123123@naver.com", folderList: myFolderList, memoList: myMemoList}, (err, memo) => {
        if (err) {
            console.log("Err at createMemo");
            console.log(err)
            return res.status(400).json({"message": "memo create err"})
        }
        if (memo) {
            console.log({memo});
            return res.status(200).json({ memo })
        }
    })
}

export const updateMemo = (req, res) => {
    
}

export const deleteMemo = (req, res) => {
    
}

export const exportMemo = (req, res) => {
    
}