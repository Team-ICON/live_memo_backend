import Memo from "../model/memo";
import User from "../model/user";
import mongoose from "mongoose";
import { v4 } from 'uuid';


// async await        

export const createMemo = async (req, res) => {
    // 1.유저 아이디 받아오기(유저 데이터에 있는지랑 로그인 여부는 미들웨어에서 통과했다고 생각함)
    // const { userid } = req.body; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    // test용 유저 그냥 해봄
    const userId = "TEST";

    // 2. 빈 메모 생성해서 DB에 넣어주기
    const newMemo = {
        ID : v4(),
        content: "",
        userList: [userId],
    }
    await Memo.create(newMemo, (err, newMemo) => {
        if (err) {
            console.log("err at createMemo");
            console.error(err);
            return res.status(400).json({ "message": "err.message"});
        }
        if (newMemo) {
    // 3. 방금 생성된 메모 id를 해당 유저 DB의 memoList에 추가해주기
            const memoId = newMemo.ID;
            // memoList map을 가져온 뒤 수정 --> 다시 저장
            User.findOne({ID : userId}, async(err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({"message": "no such id"})
                }

                let memoList = user.memoList;
                let folderList = user.folderList;

                if (!memoList || !folderList) { // memoList 없는 경우(undefined)
                    memoList = new Map();
                }

                if (!folderList) { // folderList 없는 경우(undefined)
                    folderList = new Map();
                    folderList.set("DEFAULT", []);
                    folderList.set("BOOKMARK", []);
                }

                memoList.set(memoId, "DEFAULT");   // {생성된 메모id: "디폴트"}
                folderList.get("DEFAULT").push(memoId);   // {생성된 메모id: "디폴트"}

                // const newFolderList = folderList.get("DEFAULT")
                // newFolderList.push(memoId);


                // User DB에 변경사항 다시 저장
                await User.findOneAndUpdate({ID : userId}, {memoList: memoList, folderList: folderList})

                return res.status(200).json({ "message": "memo created successfully" });
            });
        }
    })

}

export const showMemo = (req, res) => { //메모 조회

}

export const saveMemo = (req, res) => {
    // 1. memo id, content 받아오기
    // const { content } = req.body; // request로부터 content, 메모 id 받아옴(원래는 구글 토큰에서 추출)
    // const { memoId } = req.body;    // test용
    const memoId = "ea15d81c-1101-4d15-beb1-9fe6cf592439";
    const content = "aaaaaaaaaaa";

    // 2. db에서 해당 메모 찾기
    Memo.findOneAndUpdate({ID : memoId}, {updateTime: Date.now(), content : content}, (err, modified) => {
        if (err) throw err;
        return res.status(200).json({ "message": "memo saved successfully" });
    });
}

export const deleteMemo = (req, res) => {

    // userid, memoid 가져오기 
    // const { userId } = req.body; // request로부터 유저 id, 메모 id 받아옴(원래는 구글 토큰에서 추출)
    // const { memoId } = req.body;

    // test용 유저 그냥 해봄
    const userId = "TEST";
    const memoId = "bf92f16b-9d74-4d27-a954-924433e684e6";

    ////////////////////////////////////////////////////////////////////////
    // 유저 데이터 

    // 해당 user 데이터의 memolist에서 지우려는 memoid를 제거 
    User.findOne({ID : userId}, async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({"message": "no such id"})
        }

        //  1) folderlist map,  memolist map 가져오기
        let folderList = user.folderList;
        let memoList = user.memoList;

        //  2) 삭제해야할 메모를 가지고 있는 폴더 찾기
        let targetFolder = memoList.get(memoId);

        // 3) memolist map에 ("memoId") 있는지 확인하기
        if (!targetFolder) {
            console.log("no such memo");
            return res.status(400).json({"message": "no such memo"})
        }

        // 4) 찾은 폴더에서 메모 삭제하고 폴더 갱신하기
        const newTargetFolderList = folderList.get(targetFolder).filter(item => item !== memoId);
        folderList.set(targetFolder, newTargetFolderList);

 
        // 5) 찾은 메모 delete 
        memoList.delete(memoId);
        
        // 6) 변경사항  DB에 저장
        await User.findOneAndUpdate({ID : userId}, {memoList: memoList, folderList: folderList});


        ////////////////////////////////////////////////////////////////////////
        // 메모 데이터
        Memo.findOne({ID : memoId}, async (err, memo) => {
    
            // 1) 해당 메모에서 유저리스트 가져와서, 해당 리스트 내 해당 유저 지우기
            let userList = memo.userList;
    
            userList = userList.filter(item => item !== userId);

            // 2) 유저리스트 길이가 0이 되면 실제 DB에서 메모 데이터 삭제
            if (userList.length === 0) {
                Memo.deleteOne({ID : memoId}, (err, res) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({"message": "delete failed"})
                    }
                })
            }
        
            // 3) 변경사항  DB에 저장
            await Memo.findOneAndUpdate({ID : memoId}, {userList: userList});
    
        })
        return res.status(200).json({ "message": "memo deleted successfully" });
    })

}