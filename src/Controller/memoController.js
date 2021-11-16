import Memo from "../model/memo";
import User from "../model/user";
import mongoose from "mongoose";
import { v4 } from 'uuid';

import { moveFolderUtil } from "../utils2";

// async await        

export const createMemo = (req, res) => {
    // 1.유저 아이디 받아오기(유저 데이터에 있는지랑 로그인 여부는 미들웨어에서 통과했다고 생각함)
    // const { userid } = req.body; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    // test용 유저 그냥 해봄
    const userId = "SeoL";

    // 2. 빈 메모 생성해서 DB에 넣어주기
    const newMemo = {
        ID : v4(),
        content: "",
        userList: [userId],
    }

    //유저 생성 test용
    // User.create({email: "seo@test.com"}, (err, user) => {
    //     if(err) {
    //         console.log(err);
    //     }
    //     console.log(user);
    // })

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

                if (!memoList) { // memoList 없는 경우(undefined)
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
    console.log('showMemo');
    // let { userId } = req.body;
    let userId = '618e50689f7b6b438695fc2c';
    User.findOne({ userId }, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "err at showMemo" })
        }

        let memoList = user.memoList;
        // let memoIds = memoList.keys();
        // console.log(`typeof(memoIds)`, typeof(memoIds));

        let bookmarkList = user.folderList.get("BOOKMARK");

        let arrangedList = [];
        arrangedList.push(...bookmarkList);

        memoList.forEach((value, key) => {
            if (!arrangedList.includes(key)) {
                arrangedList.push(key)
            } 
        });


        console.log(`memoList`, memoList);
        console.log(`bookmarkList`, bookmarkList);
        console.log(`arrangedList`, arrangedList);
        
        /*
        const ids =  [
            '4ed3ede8844f0f351100000c',
            '4ed3f117a844e0471100000d', 
            '4ed3f18132f50c491100000e',
        ];
        
        Model.find().where('_id').in(ids).exec((err, records) => {});
        */

       Memo.find().where('ID').in(arrangedList).exec((err, records) => {
           if (err) {
               console.log(err)
               return res.status(400).json({"message": "err at showMemo"})
            }
            if (records) {
                console.log(records)
                return res.status(200).json({ "message": "오케이 계획대로 되고있어" });
            }
        })
    })
}

export const viewMemo = (req, res) => {
    const { memoId } = req.body;
    Memo.findOne({ID : memoId}, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({"message": "err at viewMemo"});
        }
        if (result) {
            return res.status(200).json({ result });
        }
    });   
}

export const saveMemo = (req, res) => {
    // 1. memo id, content 받아오기
    // const { content } = req.body; // request로부터 content, 메모 id 받아옴(원래는 구글 토큰에서 추출)
    // const { memoId } = req.body;    // test용
    const memoId = "4bf120e5-28b3-426d-ae07-d759c4346379";
    const content = "please";

    // 2. db에서 해당 메모 찾기
    Memo.findOneAndUpdate({ID : memoId}, {updateTime: Date.now(), content : content}, (err, modified) => {
        if (err) {
            console.log(err);
            return res.status(400).json({"message": "memo saved failed"});
        }
        return res.status(200).json({ "message": "memo saved successfully" });
    });
}

export const deleteMemo = (req, res) => {

    // userid, memoid 가져오기 
    // const { userId } = req.body; // request로부터 유저 id, 메모 id 받아옴(원래는 구글 토큰에서 추출)
    // const { memoId } = req.body;

    // test용 유저 그냥 해봄
    const userId = "SeoL";
    const memoId = "4bf120e5-28b3-426d-ae07-d759c4346379";

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

export const addBookmark = async(req, res) => {
    const userId = "618e50689f7b6b438695fc2c";
    const memoId = "9db12b21-51cc-4cd9-b067-a946a8ef811e";
    const afterFolderName = "BOOKMARK";
    
    try {
        // moveFolderUtil(userId, memoId, afterFolderName, req, res);
        let jojo = await moveFolderUtil(userId, memoId, afterFolderName);
    
        console.log(`jojo`, jojo);
        jojo.then((err, siba) => {
            console.log(`siba`, siba);
        })
    } catch (err) {
        console.log(err)
    }
};

export const removeBookmark = (req, res) => {
    const userId = "618e50689f7b6b438695fc2c";
    const memoId = "9db12b21-51cc-4cd9-b067-a946a8ef811e";
    const afterFolderName = "DEFAULT";
    
    // moveFolderUtil(userId, memoId, afterFolderName, req, res);
    let momo = moveFolderUtil(userId, memoId, afterFolderName);
    console.log(`momo`, momo);
    momo.then((err, siba) => {
        console.log(`siba`, siba);
    })

};

export const checkBookmark = (req, res) => {
    const userId = "618e50689f7b6b438695fc2c";
    const memoId = "4bf120e5-28b3-426d-ae07-d759c4346379";

    User.findOne({ID: userId}, async(err, user) => {
        try {
            if (err) {
                console.log(err);
                return res.status(400).json({"message": "err at addbookmark"});
            }
    
            let folderList = user.folderList;
            console.log(`folderList`, folderList);
            let bookmarkList = folderList.get("BOOKMARK");
            console.log(`bookmarkList`, bookmarkList);
            console.log(`bookmarkList.includes(memoId)`, bookmarkList.includes(memoId));
            if (bookmarkList.includes(memoId)) {
                // already bookmarked;
                let bookmarkedIdx = bookmarkList.indexOf(memoId);
                if (bookmarkedIdx > -1) {
                    bookmarkList.splice(bookmarkedIdx, 1);
                }
                console.log(`folderList`, folderList);
                console.log('bookmark removed');
                await User.findOneAndUpdate({ID : userId}, {folderList: folderList});
                return res.status(200).json({"message": "remove at addbookmark"});
            } else {
                // add check bookmarked;
                bookmarkList.push(memoId);
                console.log('bookmark added');
                await User.findOneAndUpdate({ID : userId}, {folderList: folderList});
                return res.status(200).json({"message": "add at addbookmark"});
            }
        } catch (err) {
            console.log(err);
            return res.status(400).json({"message": "something happened in checkBookmark"});
        }
    })
}


