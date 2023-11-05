let initstate = {
    value: "默认值"
}
const readucer = (state = initstate, action) => {
    console.log('paifashijian', action, state);
    switch (action.type) {
        case 'send_type':

            return state + '1'

        default:
            return state
    }
}
module.exports = {
    readucer
}