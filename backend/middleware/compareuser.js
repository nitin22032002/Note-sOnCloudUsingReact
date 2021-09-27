const pool = require('../db')
const compareuser = async(req, res, next) => {
    try {
        
        if (!req.params.noteid) {
           
            return res.json(404).json({ status: false, message: "Not found" })
        }
        await pool.query('select userid from inotebook.note where noteid=?', [req.params.noteid], (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ status: false, message: "internal error" })
            }
            else if (result.length === 0) {
                return res.status(404).json({ status: false, message: "Not found" })
            }
            else {
                if (result[0].userid === req.user.userid) {
                    next();
                }
                else {
                    return res.status(401).json({ status: false, message: "invalid authentication" })
                }
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: "Internal server error" })
    }
}
module.exports=compareuser;