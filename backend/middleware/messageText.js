function message(message){
    let a=""
    for(let item of message){
        a+=`${item.msg} , `
    }
    return a.slice(0,a.length-1)
}
module.exports=message