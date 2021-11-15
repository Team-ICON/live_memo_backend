import Memo from "../model/memo";
import User from "../model/user";
import mongoose from "mongoose";
import { v4 } from 'uuid';

// async await        

export const createMemo = (req, res) => {
    // 1.유저 아이디 받아오기(유저 데이터에 있는지랑 로그인 여부는 미들웨어에서 통과했다고 생각함)
    // const { userid } = req.body; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    // test용 유저 그냥 해봄
    const userId = "618e50689f7b6b438695fc2c";

    // 2. 빈 메모 생성해서 DB에 넣어주기
    const newMemo = {
        ID : v4(),
        content: "",
        userList: [userId],
    }
    Memo.create(newMemo, async(err, newMemo) => {
        try {
            if (err) {
                console.log("err at createMemo");
                console.error(err);
                return res.status(400).json({ "message": "err.message"});
            }
            if (newMemo) {

                const memoId = newMemo.ID;

                User.findById(userId, async(err, user) => {
                    try {
                        let memoList = user.memoList;
                        if (!memoList) { 
                            memoList = new Map();
                        }
                        memoList.set(memoId, "DEFAULT");   
            
                        let folderList = user.folderList;
                        folderList.get("DEFAULT").push(memoId);   

                        await User.findOneAndUpdate({ ID: userId}, {memoList: memoList, folderList: folderList});
                        return res.status(200).json({ "message": "memo created successfully" });
                    } catch (err) {
                        console.log(`err`, err)
                    }

                 
                });
    
            }
        } catch (err) {
            console.log(err)
            return res.status(400).json({"message" : "err at createMemo"});
        }
    })

}

export const showMemo = (req, res) => { //메모 조회
    // let { userId } = req.body;
    let userId = '618e50689f7b6b438695fc2c';
    User.findOne({ userId }, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "err at showMemo" })
        }

        let memoList = user.memoList;
        let memoIds = memoList.keys();

        let bookmarkList = user.bookmarkList;

        
        /*
        const ids =  [
            '4ed3ede8844f0f351100000c',
            '4ed3f117a844e0471100000d', 
            '4ed3f18132f50c491100000e',
        ];

        Model.find().where('_id').in(ids).exec((err, records) => {});
        */

        Memo.find().where('ID').in(memoIds).exec((err, records) => {
            if (err) {
                console.log(err)
                return res.status(400).json({"message": "err at showMemo"})
            }
            if (records) {
                console.log(records)
            }
        })
    })
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
    const memoId = "58c76de0-6313-4f55-ab76-edd96eeb542a";

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

        // 3) 찾은 폴더에서 메모 삭제하고 폴더 갱신하기
        const newTargetFolderList = folderList.get(targetFolder).filter(item => item !== memoId);
        folderList.set(targetFolder, newTargetFolderList);

        // 4) memolist map에 ("memoId") 있는지 확인하기
        if (!memoList.has(memoId)) {
            console.log("no such memo");
            return res.status(400).json({"message": "no such memo"})
        }
 
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
    });


    return res.status(200).json({ "message": "memo deleted successfully" });
}
