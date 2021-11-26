import Memo from "../model/memo";
import User from "../model/user";


export const showFolder = (req, res) => { //폴더 조회
    const user = req.user;

    User.findOne({ _id: user.ID }, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "err at showFolder" });
        }

        const folderList = user.folderList;
        const folders = Array.from(folderList.keys());


        return res.status(200).json({ success: true, folders: folders });
    })
}

export const createFolder = (req, res) => { //폴더 생성
    // 1. 리퀘스트로부터 유저ID, 생성할 폴더명 받아오기
    // 1.유저 아이디 받아오기(유저 데이터에 있는지랑 로그인 여부는 미들웨어에서 통과했다고 생각함)
    // const { userid } = req.body; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    // const { folderName } = req.body; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    // test용 유저 그냥 해봄
    const userId = req.user._id
    const folderName = req.body.folderName;

    // 2. 해당 유저 데이터에서 folderListy-(map) 받아오고 수정

    User.findOne({ _id: userId }, async (err, user) => {
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
        await User.findOneAndUpdate({ _id: userId }, { folderList: folderList });
        return res.status(200).json({ success: true, folders: folderList });
    });
}

export const deleteFolder = (req, res) => { //메모 삭제
    // 1. 리퀘스트로부터 유저ID, 삭제할 폴더명, 받아오기
    const userId = req.user._id; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    const FolderName = req.body.folderName; // request로부터 폴더명 받아옴(원래는 구글 토큰에서 추출)

    // 2. 해당 유저 데이터로부터 folderList, memolist 받아오기
    User.findOne({ _id: userId }, async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "no such ID" })
        }
        let folderList = user.folderList;
        let memoList = user.memoList;

        // 삭제하려는 폴더명이 폴더리스트에 있는지 확인
        if (!folderList.has(FolderName)) {
            console.log("cannot find folder");
            return res.status(400).json({ "message": "cannot find folder" });
        }

        // 해당 폴더명의 메모 리스트 받아오기
        let targetMemoList = folderList.get(FolderName);

        // 메모리스트 순회하면서 deleteMemo() 실행
        targetMemoList.forEach(target => {
            memoList.delete(target);
            Memo.findOne({ _id: target }, async (err, memo) => {

                // 1) 해당 메모에서 유저리스트 가져와서, 해당 리스트 내 해당 유저 지우기
                let userList = memo.userList;

                userList = (userList || []).filter(item => item !== userId);

                // 2) 유저리스트 길이가 0이 되면 실제 DB에서 메모 데이터 삭제
                if ((userList || []).length === 0) {
                    Memo.deleteOne({ _id: target }, (err, res) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).json({ "message": "delete failed" })
                        }
                    })
                }
                // 3) 변경사항  DB에 저장
                await Memo.findOneAndUpdate({ _id: target }, { userList: userList });

            })
        })

        // folderList에서 해당 folder 삭제
        folderList.delete(FolderName);

        // db에 업데이트 
        await User.findOneAndUpdate({ _id: userId }, { folderList: folderList, memoList: memoList });
        return res.status(200).json({ "message": "deleted successfully" });
    });
}

export const moveFolder = (req, res) => { //메모 이동
    // 1. 리퀘스트로부터 유저ID, 메모ID, 기존 폴더명, 이동할 폴더명 받아오기
    const userId = req.user._id
    const memoId = req.body.memoId
    const afterFolderName = "seoFolder";

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
            console.log("cannot find memo/folder");
            return res.status(400).json({ "message": "cannot find memo/folder" })
        }

        if (folderList.get(afterFolderName).includes(memoId)) {
            console.log("already exist!");
            return res.status(400).json({ "message": "already exist!" })
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
        await User.findOneAndUpdate({ _id: userId }, { memoList: memoList, folderList: folderList });
        return res.status(200).json({ "message": "moved successfully" });
    });
}


// 폴더 안에 메모들 보여주기
export const showMemosInFolder = (req, res) => { //메모 조회
    const user = req.user;
    const targetFolder = req.body.folderName;

    User.findOne({ _id: user._id }).exec((err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ "message": "err at showMemo" })
        }

        try {
            let bookmarkList = user.folderList.get("BOOKMARK");   // 정렬할때 북마크 여부 판단
            let arrangedList = user.folderList.get(targetFolder); // 타겟 폴더 내 메모들

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
                        temp.title = element.title;
                        temp.content = element.content;
                        temp.updateTime = element.updateTime;
                        temp.howManyShare = element.userList.length;

                        if (bookmarkList.includes(element._id)) {

                            temp.bookmarked = true;
                        } else {
                            temp.bookmarked = false;
                        }
                        result.push(temp);
                    });

                    result.sort((a, b) => {
                        if (a.bookmarked === b.bookmarked) {
                            return a.updateTime > b.updateTime ? -1 : 1;
                        }
                        return a.bookmarked > b.bookmarked ? -1 : 1;
                    })


                    return res.status(200).json({ success: true, memos: result });
                }
            })
        } catch (err) {
            return res.status(400).json({ "message": "작성 된 메모가 없습니다.", result: "작성된 메모가 없습니다." });
        }
    })
}