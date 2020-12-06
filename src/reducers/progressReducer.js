export default function(state = 0, action) {
    switch (action.type) {
        case 'PROGRESS_PERCENTAGE':
            return action.payload
        default:
            return state
    }
}