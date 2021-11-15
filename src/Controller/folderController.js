import Folder from "../model/folder";
import User from "../model/user";

export const addfolder = async(req, res) => {
    let userid = '618e50689f7b6b438695fc2c'
    let title = '정글'
    try {
        let folder = await Folder.create({title}, async(err, result) => {
            if (err) {
                console.log("Err at createMemo")
                console.log(err)
                return res.status(400).json({"message": "memo create err"})
            }
            
            if (result) {
                console.log(`result`, result)
                return res.status(200).json({ result })
            }

            let user = await User.findOne({ _id: userid }, (err, result) => {
                console.log(result)
            })
        })
    
        // User에  해당 폴더 생성해주기
        
    } catch (err) {
        console.log(err)
    }



    console.log(`addfolder`, addfolder);
}
