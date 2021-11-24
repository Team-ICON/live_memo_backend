
import Memo from "../model/memo";
import User from "../model/user";
import mongoose from "mongoose";
import { v4 } from 'uuid';

// import { moveFolderUtil } from "../utils";

let roomsStatus = {}
export const createMemo = (req, res) => {
    // 1.유저 아이디 받아오기(유저 데이터에 있는지랑 로그인 여부는 미들웨어에서 통과했다고 생각함)
    const { _id } = req.user; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)

    // test용 
    // const _id = "6197a5dfb2cdee4640e169cc"; //user
    // const memoId = "final";
    // const memoContent ="final"

    Memo.findOneAndUpdate({ _id: req.body._id, }, { title: req.body.title, content: req.body.body, updateTime: Date.now() }, { new: true, upsert: true }, async (err, memoInfo) => {

        if (err) {
            console.log("error find ID");
            console.error(err);
            return res.status(400).json({ "message": "err.message" });
        }
        
        let IsQuit = req.body.quit;

        //정말 저장 하고 나가는지 아니면 중간에 주기적으로 호출하는 콜백인지 구분
        if (IsQuit) {
            let val = roomsStatus[memoInfo._id]

            if (val === undefined) {
                roomsStatus[memoInfo._id] = 0
            }
            else {
                roomsStatus[memoInfo._id] = (val - 1 < 0 ? 0 : val - 1)
            }
        }

        if (req.body.first) {
            // 방금 생성된 메모 id를 해당 유저 DB의 memoList에 추가해주기
            const memoId = memoInfo._id;

            // 생성된 메모의 userList에 userId 넣어주기
            await Memo.findOneAndUpdate({ _id: memoId }, { userList: [_id] })

            User.findOne({ _id: _id }, async (err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ "message": "no such id" })
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
                if (!folderList.get("DEFAULT").includes(memoId)) {
                    folderList.get("DEFAULT").push(memoId);
                }

                // User DB에 변경사항 다시 저장
                await User.findOneAndUpdate({ _id: _id }, { memoList: memoList, folderList: folderList })
                return res.status(200).json({ "message": "memo created successfully", data: memoInfo });
            });
        }
        // 메모 업데이트(처음 생성 아닌 경우)
        else {
            return res.status(200).json({ "message": "memo updated successfully", data: memoInfo });
        }
    })

}

export const showMemos = (req, res) => { //메모 조회
    let user = req.user;

    // User.findOne({ ID: '618e50689f7b6b438695fc2c' }, (err, user) => {
    User.findOne({ _id: user._id }).exec((err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "err at showMemo" })
        }

        try {
            let memoList = user.memoList;
            // console.log("memoList memoController 88", memoList)
            // let memoIds = memoList.keys();
            // console.log(`typeof(memoIds)`, typeof(memoIds));

            let bookmarkList = user.folderList.get("BOOKMARK");

            let arrangedList = [];

            memoList.forEach((value, key) => {
                if (!arrangedList.includes(key)) {
                    arrangedList.push(key)
                }
            });
            arrangedList.push(...bookmarkList);

            Memo.find().where('_id').in(arrangedList).exec((err, records) => {
                if (err) {
                    console.log(err)
                    return res.status(400).json({ "message": "err at showMemo" })
                }
                if (records) {
                    let result = [];
                    records.forEach((element) => {
                        let temp = new Object();
                        temp._id = element._id;
                        temp.content = element.content;
                        temp.updateTime = element.updateTime;
                        temp.howManyShare = element.userList.length;

                        if (bookmarkList.includes(element._id)) {
                            temp.bookmarked = "true";
                        } else {
                            temp.bookmarked = "false";
                        }
                        result.push(temp);
                    });

                    result.sort((a, b) => {
                        if (a.bookmarked === b.bookmarked) {
                            return a.updateTime > b.updateTime ? -1 : 1;
                        }
                        return a.bookmarked > b.bookmarked ? -1 : 1;
                    })

                    console.log(result);
                    return res.status(200).json({ success: true, memos: result });
                }
            })
        } catch (err) {
            return res.status(400).json({ "message": "작성 된 메모가 없습니다.", result: "작성된 메모가 없습니다." });
        }
    })
}

export const viewMemo = (req, res) => {
    const userId = req.user._id;
    Memo.findOne({ "_id": req.params.id }, (err, memo) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "err at viewMemo" });
        }

        if (!memo) {
            console.log("no such memo!");
            return res.status(400).json({ "message": "no such memo!" });
        }
        // 해당 메모의 userList는 userId의 리스트이므로 각 유저마다 프로필, 이름사진을 찾아온다

        let curMem = roomsStatus[memo._id]
        if (curMem === undefined)
            roomsStatus[memo._id] = 1
        else
            roomsStatus[memo._id] = curMem + 1


        console.log("current Room status memocontroller 210", roomsStatus)

        const userIdList = memo.userList || [];
        const newUserIdList = [];
        const userProfileNameList = [];
        const userPictureList = [];
        const newUserObjectList = [];

        User.find({
            _id: { $in: userIdList }
        }, function (err, users) {
            users.forEach(user => {
                newUserIdList.push(user._id);
                userProfileNameList.push(user.profileName);
                userPictureList.push(user.picture);
            });


            for (let i = 0; i < userIdList.length; i++) {

                if (newUserIdList[i] === userId) {
                    continue;
                }
                newUserObjectList.push({
                    "_id": newUserIdList[i] || "",
                    "profileName": userProfileNameList[i] || "",
                    "picture": userPictureList[i] || ""
                })
            }

            let clonedMemo = JSON.parse(JSON.stringify(memo))


            clonedMemo.userList = newUserObjectList;



            return res.status(200).json({ success: true, memInfo: clonedMemo, roomsStatus });
        });
    })

}


//이거는 나중에 시그널링 되고 다시 봐야할듯
export const saveMemo = (req, res) => {
    // 1. memo id, content 받아오기
    const { content } = req.body; // request로부터 content, 메모 id 받아옴(원래는 구글 토큰에서 추출)
    const { memoId } = req.body;    // test용
    // const memoId = "4bf120e5-28b3-426d-ae07-d759c4346379";
    // const body = "please";

    // 2. db에서 해당 메모 찾기
    Memo.findOneAndUpdate({ _id: memoId }, { updateTime: Date.now(), body: body }, (err, modified) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "memo saved failed" });
        }
        return res.status(200).json({ "message": "memo saved successfully" });
    });
}

export const deleteMemo = (req, res) => {

    // userid, memoid 가져오기
    const { _id } = req.user; // request로부터 유저 id, 메모 id 받아옴(원래는 구글 토큰에서 추출)
    const { memoId } = req.body;
    // test용 유저 그냥 해봄
    console.log(_id, memoId);
    ////////////////////////////////////////////////////////////////////////
    // 유저 데이터
    // 해당 user 데이터의 memolist에서 지우려는 memoid를 제거
    let curMem = roomsStatus[memoId]

    roomsStatus[memoId] = curMem - 1

    console.log("current Room status memocontroller 269", roomsStatus)
    User.findOne({ _id: _id }, async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "no such id" })
        }
        //  1) folderlist map,  memolist map 가져오기
        let folderList = user.folderList;
        let memoList = user.memoList;
        //  2) 삭제해야할 메모를 가지고 있는 폴더 찾기
        let targetFolder = memoList.get(memoId);
        // 3) memolist map에 ("memoId") 있는지 확인하기
        if (!targetFolder) {
            console.log("no such memo");
            return res.status(400).json({ "message": "no such memo" })
        }
        // 4) 찾은 폴더에서 메모 삭제하고 폴더 갱신하기
        const newTargetFolderList = folderList.get(targetFolder).filter(item => item !== memoId);
        folderList.set(targetFolder, newTargetFolderList);
        // 5) 찾은 메모 delete
        memoList.delete(memoId);

        ////////////////////////////////////////////////////////////////////////
        // 메모 데이터
        Memo.findOne({ _id: memoId }, async (err, memo) => {
            // 1) 해당 메모에서 유저리스트 가져와서, 해당 리스트 내 해당 유저 지우기
            let userList = memo.userList;
            userList = userList.filter(item => item !== _id);
            // 2) 유저리스트 길이가 0이 되면 실제 DB에서 메모 데이터 삭제
            if (userList.length === 0) {
                Memo.deleteOne({ _id: memoId }, (err, res) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({ "message": "delete failed" })
                    }
                })
            }
            // 3) 변경사항  DB에 저장
            await Memo.findOneAndUpdate({ _id: memoId }, { userList: userList });
            await User.findOneAndUpdate({ _id: _id }, { memoList: memoList, folderList: folderList });
        })
        return res.status(200).json({ "message": "memo deleted successfully" });
    })
}

export const addBookmark = async (req, res) => {

    const userId = req.user._id
    const memoId = req.body.memoId
    const afterFolderName = "BOOKMARK";


    // 2. 해당 유저 데이터로부터 memoList, folderList 받아오기
    User.findOne({ _id: userId }, async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "no such id" })
        }
        let folderList = user.folderList;
        let memoList = user.memoList;
        const beforeFolderName = memoList.get(memoId);
        // 받아온 메모id가 있는지 확인 필요
        // 받아온 메모의 폴더가 beforeFolderName과 일치하는지 확인 필요
        // 이동하려는 폴더명이 폴더리스트에 없는 경우 에러 처리
        if (!memoList.has(memoId) || !folderList.has(afterFolderName)) {
            console.log("!memoList.has(memoId)", !memoList.has(memoId))
            console.log("!folderList.has(afterFolderName)", !folderList.has(afterFolderName))
            console.log("cannot find memo/folder");
            return res.status(400).json({ "message": "cannot find memo/folder" })
        }

        if (folderList.get(afterFolderName).includes(memoId)) {
            console.log("already existing in BOOKMARK!");
            return res.status(400).json({ "message": "already exist in BOOKMARK!" })
        }

        // 3. memoList에서 해당 메모ID 의 폴더명 변경
        memoList.set(memoId, afterFolderName);

        // 4-1. folderList의 기존 폴더 리스트에서 해당 메모ID 지우기
        const beforeFolderList = folderList.get(beforeFolderName).filter(item => item !== memoId);

        // 4-2. folderList의 이동할 폴더 리스트에서 해당 메모ID 추가
        const afterFolderList = folderList.get(afterFolderName)
        afterFolderList.push(memoId);

        // DB에 {memoList: memoList, folderList: folderList} 반영
        folderList.set(beforeFolderName, beforeFolderList);
        folderList.set(afterFolderName, afterFolderList);
        await User.findOneAndUpdate({ ID: userId }, { memoList: memoList, folderList: folderList });
        return res.status(200).json({ "message": "moved successfully" });

    });
};

export const removeBookmark = (req, res) => {
    const userId = "618e50689f7b6b438695fc2c";
    const memoId = "9db12b21-51cc-4cd9-b067-a946a8ef811e";
    const afterFolderName = "DEFAULT";

    // 2. 해당 유저 데이터로부터 memoList, folderList 받아오기
    User.findOne({ _id: userId }, async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "no such id" })
        }
        let folderList = user.folderList;
        let memoList = user.memoList;
        const beforeFolderName = memoList.get(memoId);

        if (beforeFolderName !== "BOOKMARK") {
            console.log("this is not bookmarked memo");
            return res.status(400).json({ "message": "this is not bookmarked memo" });
        }

        // 받아온 메모id가 있는지 확인 필요
        // 받아온 메모의 폴더가 beforeFolderName과 일치하는지 확인 필요
        // 이동하려는 폴더명이 폴더리스트에 없는 경우 에러 처리
        if (!memoList.has(memoId) || !folderList.has(afterFolderName)) {
            console.log("cannot find memo/folder");
            return res.status(400).json({ "message": "cannot find memo/folder" })
        }

        if (folderList.get(afterFolderName).includes(memoId)) {
            console.log("already existing in DEFAULT!");
            return res.status(400).json({ "message": "already exist in DEFAULT!" })
        }

        // 3. memoList에서 해당 메모ID 의 폴더명 변경
        memoList.set(memoId, afterFolderName);

        // 4-1. folderList의 기존 폴더 리스트에서 해당 메모ID 지우기
        const beforeFolderList = folderList.get(beforeFolderName).filter(item => item !== memoId);

        // 4-2. folderList의 이동할 폴더 리스트에서 해당 메모ID 추가
        const afterFolderList = folderList.get(afterFolderName)
        afterFolderList.push(memoId);

        // DB에 {memoList: memoList, folderList: folderList} 반영
        folderList.set(beforeFolderName, beforeFolderList);
        folderList.set(afterFolderName, afterFolderList);
        await User.findOneAndUpdate({ ID: userId }, { memoList: memoList, folderList: folderList });
        return res.status(200).json({ "message": "moved successfully" });

    });

};

export const addUser = async (req, res) => {
    const userEmail = req.body.userEmail;
    const memoId = req.body.memoId;
    // 메모를 만든 유저 아이디
    const _userId = req.user;

    //test용
    // const userEmail = "test@test.com";
    // const memoId = "6198a082fbb0a29d0154b5f5";

    // User
    // 추가할 사용자를 이메일 주소로 검색한다
    User.findOne({ email: userEmail }, async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "cannot find this email" })
        }

        if (!user) {
            console.log("no such user!");
            return res.status(400).json({ "message": "cannot find this email" });
        }
        // 추가할 유저의 id, 폴더리스트, 메모리스트 받아오기
        let userId = user._id;
        let folderList = user.folderList;
        let memoList = user.memoList;
        const profileName = user.profileName || "";
        const picture = user.picture || "";

        if (!memoList) { // 추가하려는 유저가 memoList가 없는 경우(undefined)
            memoList = new Map();
        }

        if (!folderList) { // 추가하려는 유저가 folderList 없는 경우(undefined)
            folderList = new Map();
            folderList.set("DEFAULT", []);
            folderList.set("BOOKMARK", []);
        }

        // 추가하려는 유저의 메모리스트에 이미 해당 메모가 있는 경우 예외 처리( 중복 추가 방지 )
        if (memoList.has(memoId)) {
            console.log("already exist!");
            return res.status(400).json({ "message": "already exist!" })
        }

        // 메모리스트 내, 해당 메모 추가하기 + 폴더리스트의 default 폴더에 해당 메모 추가하기
        memoList.set(memoId, "DEFAULT");
        folderList.get("DEFAULT").push(memoId);

        Memo.findOne({ _id: memoId }, async (err, memo) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ "message": "no such memo" })
            }
            let userList = memo?.userList;


            if (userList) {
                userList.push(userId);

            }
            else {
                userList = [_userId._id];
                userList.push(userId);
            }

            // db에 업데이트 해주기
            await User.findOneAndUpdate({ _id: userId }, { memoList: memoList, folderList: folderList });
            await Memo.findOneAndUpdate({ _id: memoId }, { userList: userList });

            return res.status(200).json({ success: true, "message": "add user successfully", "userdata": { "profileName": profileName, "picture": picture } });
        });
    });
}

export const getUserListOfMemo = (req, res) => {
    const userId = req.user._id;
    Memo.findOne({ "_id": req.params.id }, (err, memo) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "err at viewMemo" });
        }

        if (!memo) {
            console.log("no such memo!");
            return res.status(400).json({ "message": "no such memo!" });
        }
        // 해당 메모의 userList는 userId의 리스트이므로 각 유저마다 프로필, 이름사진을 찾아온다

        let curMem = roomsStatus[memo._id]
        if (curMem === undefined)
            roomsStatus[memo._id] = 1
        else
            roomsStatus[memo._id] = curMem + 1


        console.log("current Room status memocontroller 210", roomsStatus)

        const userIdList = memo.userList || [];
        const newUserIdList = [];
        const userProfileNameList = [];
        const userPictureList = [];
        const newUserObjectList = [];

        User.find({
            _id: { $in: userIdList }
        }, function (err, users) {
            users.forEach(user => {
                newUserIdList.push(user._id);
                userProfileNameList.push(user.profileName);
                userPictureList.push(user.picture);
            });


            for (let i = 0; i < userIdList.length; i++) {
                if (newUserIdList[i] === userId) {
                    continue;
                }
                newUserObjectList.push({
                    "_id": newUserIdList[i] || "",
                    "profileName": userProfileNameList[i] || "",
                    "picture": userPictureList[i] || ""
                })
            }

            let clonedMemo = JSON.parse(JSON.stringify(memo))
            clonedMemo.userList = newUserObjectList;

            return res.status(200).json({ success: true, newUserObjectList });
        });
    })
}