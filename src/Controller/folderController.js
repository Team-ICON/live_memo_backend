import Memo from "../model/memo";
import User from "../model/user";


export const showFolder = (req, res) => { //메모 조회
    // let { userid } = req.body;
    let userid = '618e50689f7b6b438695fc2c';
    User.findOne({ ID: userId }, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({"message": "err at showFolder"});
        }

        let folderList = user.folderList;
        let folders = folderList.keys();

        return res.status(200).json({ folders });
    })
}

export const createFolder = (req, res) => { //폴더 생성
    // 1. 리퀘스트로부터 유저ID, 생성할 폴더명 받아오기
    // 1.유저 아이디 받아오기(유저 데이터에 있는지랑 로그인 여부는 미들웨어에서 통과했다고 생각함)
    // const { userid } = req.body; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    // const { folderName } = req.body; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    // test용 유저 그냥 해봄
    const userId = "SeoL";
    const folderName = "seoFolder";
    
    // 2. 해당 유저 데이터에서 folderListy-(map) 받아오고 수정

    User.findOne({ID : userId}, async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({"message": "no such id"})
        }

        let folderList = user.folderList;
        // 이미 존재하는 폴더인 경우, 에러 처리
        if (folderList.has(folderName)) { 
            console.log("already existing folder");
            return res.status(400).json({"message": "already existing folder"})
        }
    // 폴더 리스트에 폴더명 추가해주기
        folderList.set(folderName, []);
        console.log(folderList);

    // 3. DB에 {folderList: folderList} 반영하기
        await User.findOneAndUpdate({ID : userId}, {folderList: folderList});
        return res.status(200).json({ "message": "folder created successfully" });
    });
}

export const deleteFolder = (req, res) => { //메모 삭제
    // 1. 리퀘스트로부터 유저ID, 삭제할 폴더명, 받아오기
    // const { userid } = req.body; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    // const { FolderName } = req.body; // request로부터 폴더명 받아옴(원래는 구글 토큰에서 추출)
    // test용 유저 그냥 해봄
    const userId = "SeoL";
    const folderName = "seoFolder";

    // if (folderName === "BOOKMARK" || folderName ==="DEFAULT") {
    //     console.log(err)
    //     return res.status(400).json({"message": "cannot delete this folder"});
    // }

    // 2. 해당 유저 데이터로부터 folderList, memolist 받아오기
    User.findOne({ID : userId}, async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({"message": "no such ID"})
        }
        let folderList = user.folderList;
        let memoList = user.memoList;

    // 삭제하려는 폴더명이 폴더리스트에 있는지 확인
        if (!folderList.has(folderName)) {
            console.log("cannot find folder");
            return res.status(400).json({"message": "cannot find folder"});
        }

    // 해당 폴더명의 메모 리스트 받아오기
        let targetMemoList = folderList.get(folderName);
        // console.log(targetMemoList);
    // 메모리스트 순회하면서 deleteMemo() 실행
        targetMemoList.forEach(target => {
            memoList.delete(target);
            Memo.findOne({ID : target}, async (err, memo) => {
    
                // 1) 해당 메모에서 유저리스트 가져와서, 해당 리스트 내 해당 유저 지우기
                let userList = memo.userList;
        
                userList = (userList || []).filter(item => item !== userId);
    
                // 2) 유저리스트 길이가 0이 되면 실제 DB에서 메모 데이터 삭제
                if ((userList || []).length === 0) {
                    Memo.deleteOne({ID : target}, (err, res) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).json({"message": "delete failed"})
                        }
                    })
                }
                // 3) 변경사항  DB에 저장
                await Memo.findOneAndUpdate({ID : target}, {userList: userList});
        
            })
        })

        // folderList에서 해당 folder 삭제
        folderList.delete(folderName);
    
    // db에 업데이트 
    await User.findOneAndUpdate({ID : userId}, {folderList: folderList, memoList: memoList});
    return res.status(200).json({ "message": "deleted successfully" });
    });
}

export const moveFolder = (req, res) => { //메모 이동
    // 1. 리퀘스트로부터 유저ID, 메모ID, 기존 폴더명, 이동할 폴더명 받아오기
    // 1.유저 아이디 받아오기(유저 데이터에 있는지랑 로그인 여부는 미들웨어에서 통과했다고 생각함)
    // const { userid } = req.body; // request로부터 유저 id 받아옴(원래는 구글 토큰에서 추출)
    // const { memoId } = req.body; // request로부터 memo id 받아옴(원래는 구글 토큰에서 추출)
    // const { afterFolderName } = req.body; // request로부터 afterFolderName 받아옴(원래는 구글 토큰에서 추출)
    // test용 유저 그냥 해봄
    const userId = "SeoL";
    const memoId = "9c2f0bba-6dad-4023-92b7-e702634fe0fa";
    const afterFolderName = "seoFolder";
    
    // 2. 해당 유저 데이터로부터 memoList, folderList 받아오기
    User.findOne({ID : userId}, async (err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({"message": "no such id"})
        }
        let folderList = user.folderList;
        let memoList = user.memoList;
        const beforeFolderName = memoList.get(memoId);
        // 받아온 메모id가 있는지 확인 필요
        // 받아온 메모의 폴더가 beforeFolderName과 일치하는지 확인 필요
        // 이동하려는 폴더명이 폴더리스트에 없는 경우 에러 처리
        if (!memoList.has(memoId) || memoList.get(memoId) !== beforeFolderName || !folderList.has(afterFolderName)) {
                console.log("cannot find memo/folder");
                return res.status(400).json({"message": "cannot find memo/folder"})
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
        await User.findOneAndUpdate({ID : userId}, {memoList: memoList, folderList: folderList});
        return res.status(200).json({ "message": "moved successfully" });
    });
}