const pool = require('../db')
const uniqueTitle = async(req, res, next) => {
    try {
        await pool.query('select noteid from inotebook.note where userid=? and title=?', [req.user.userid,req.body.title,req.params.noteid], (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ status: false, message: "Internal Server Error" })
            }
            else if (result.length === 0) {
                next();
            }
            else {
                if (result[0].noteid===req.params.noteid) {
                    next();
                }
                else {
                    return res.status(400).json({ status: false, message: "You Already Use This Title In Your Note's" })
                }
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: "Internal server error" })
    }
}
module.exports=uniqueTitle;