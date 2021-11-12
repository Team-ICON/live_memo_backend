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
                if (!memoList) { // memoList 없는 경우(undefined)
                    memoList = new Map();
                }
                memoList.set(memoId, "DEFAULT");   // {생성된 메모id: "디폴트"}
                
                // User DB에 변경사항 다시 저장
                await User.findOneAndUpdate({ID : userId}, {memoList: memoList})
                // .exec(); // .exec() 써야하는건가??

                return res.status(200).json({ "message": "memo created successfully" });
            });
        }
    })

}

export const updateMemo = (req, res) => { //업데이트

}

export const deleteMemo = (req, res) => {
    // userid, memoid 가져오기 
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
            // console.log(targetUser);
            // 2) 유저리스트 길이가 0이 되면 진짜로 지우기
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


    // 3. 해당 memo 데이터의 useList에서 해당 userid를 제거
    // 1) uerlist의 length가 0이명 몽구스 내에서 해당 메모 완전 삭제
}

export const saveMemo = (req, res) => {
    
}