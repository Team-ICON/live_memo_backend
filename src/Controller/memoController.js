import Memo from "../model/memo";

// async await        

export const createMemo = async(req, res) => {
    const { userid } = req.body;
    const userid = req.body.userid;
    Memo.create({ users: userid})
    .exec((err, memo) => {
        if (err) {
            console.log("Err at createMemo");
            console.log(err)
            return res.status(400).json({"message": "memo create err"})
        }
        if (memo) {
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