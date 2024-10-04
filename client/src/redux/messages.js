import { createSlice } from "@reduxjs/toolkit";

let messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        prompt: '',
        content: '',
        _id: null,
        latest: {
            prompt: '',
            content: '',
            imageUrl: '', 
        },
        all: []
    },
    reducers: {
        emptyAllRes: () => {
            return {
                prompt: '',
                content: '',
                _id: null,
                latest: {
                    prompt: '',
                    content: ''
                },
                all: []
            }
        },
        addList: (state, { payload }) => {
            const { _id, items } = payload
            state._id = _id
            state.all = items
            return state
        },
        insertNew: (state, { payload }) => {
            const { 
                chatsId, content = null,resume = false, _id = null, prompt = null,imageUrl = null
            } = payload

            if (_id) {
                state._id = _id
            }

            state.latest.id = chatsId

            if (prompt) {
                state.latest.prompt = prompt
            }



            const addToList = (latest) => {
                if (state['all'].find(obj => obj.id === latest.id)) {
                    state['all'].forEach(obj => {
                        if (obj.id === latest.id) {
                            obj.content = latest.content
                            obj.imageUrl = latest.imageUrl
                        }
                    })
                } else {
                    state['all'].push(latest)
                }
            }

            if (content && resume) {
                state.latest.content = content
                state.latest.imageUrl = null
                if (imageUrl) {
                    state.latest.imageUrl = imageUrl // Set the imageUrl field
                }
                addToList(state.latest)

            } 
            return state
        },
        livePrompt: (state, { payload }) => {
            state.prompt = payload
            return state
        }
    }
})

export const { emptyAllRes, insertNew, livePrompt, addList } = messagesSlice.actions
export default messagesSlice.reducer