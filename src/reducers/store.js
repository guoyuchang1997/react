import { createStore, combineReducers } from 'redux'
import { readucer, todos } from './reaucer/index.js'
const reaucer = combineReducers({
    readucer, todos
})
const store = createStore(reaucer)


export default store