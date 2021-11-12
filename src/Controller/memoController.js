import Memo from "../model/memo";

// async await        

export const createMemo = async(req, res) => {
    // const {userid} = req.body;
    
    const myMemo = new Map();
    Memo.create(myMemo, (err, memo) => {
        if (err) {
            console.log("err at createMemo");
            console.error(err);
            return res.status(400).json({ "message": "err.message"});
        }
        if (memo) {
            console.log(memo);
            return res.status(200).json({ memo });
        }
    })
  }

export const saveMemo = (req, res) => {
    
}

export const updateMemo = (req, res) => { //업데이트

}

export const deleteMemo = (req, res) => {
    
}

export const exportMemo = (req, res) => {
    
}