import User from "./model/user";

export const moveFolderUtil = async(getId, getMemoId, afterFolder) => {
    const userId = getId;
    const memoId = getMemoId;
    const afterFolderName = afterFolder;
    
    try {
        let result = await User.findOne({ID : userId}, async(err, user) => {
            if (err) {
                console.log(err);
                return false;
                // return res.status(400).json({"message": "no such id"})   
            }
            let folderList = user.folderList;
            let memoList = user.memoList;
            
            const beforeFolderName = memoList.get(memoId);
            // 받아온 메모id가 있는지 확인 필요
            // 받아온 메모의 폴더가 beforeFolderName과 일치하는지 확인 필요
            // 이동하려는 폴더명이 폴더리스트에 없는 경우 에러 처리
            if (!memoList.has(memoId) || memoList.get(memoId) !== beforeFolderName || !folderList.has(afterFolderName)) {
                    console.log("cannot find memo/folder");
                    return false;
                    // return res.status(400).json({"message": "cannot find memo/folder"})
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
    
            console.log(`{memoList, folderList}`, {memoList, folderList});
    
            let result2 = await User.updateOne({ID : userId}, {memoList: memoList, folderList: folderList})
            .exec((err, result) => {
                if (err) {
                    return false;
                }
                if (result) {
                    console.log('update executed');
                    return true;
                }
            })
            console.log(`result2`, result2)
        })
        return result;

    } catch(err){
        console.log(err)
    }

    // 2. 해당 유저 데이터로부터 memoList, folderList 받아오기
}