const initstate = {
    value: "默认值"
}
export const readucer = (state = initstate, action) => {
    switch (action.type) {
        case 'send_type':

            return state + '1'

        default:
            return state
    }
}
// 默认值：
const initialState = [
    { id: 1, text: '吃饭', done: true },
    { id: 2, text: '学习', done: false },
    { id: 3, text: '睡觉', done: true }
]

export const todos = (state = initialState, action) => {
    console.log(state, action);
    switch (action.type) {
        case 'add_false':
            console.log('进去了');
            return state.filter(item => item.id !== action.value)

        default:
            return state
    }
}

