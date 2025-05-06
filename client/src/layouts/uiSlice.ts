import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum LoadingPriority {
    NONE = 0, // Không hiển thị loading
    LOW = 1, // Loading nhỏ (inline/component)
    MEDIUM = 2, // Loading cho section
    HIGH = 3, // Loading toàn màn hình
}

const getInitDarkMode = () => {
    const storedDarkMode = localStorage.getItem('darkMode')
    return storedDarkMode ? JSON.parse(storedDarkMode) : false
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isLoading: false,
        loadingPriority: LoadingPriority.NONE,
        isDarkMode: getInitDarkMode(),
    },
    reducers: {
        startLoading: (state, action: PayloadAction<LoadingPriority>) => {
            if (action.payload >= LoadingPriority.HIGH)
                state.isLoading = true
            state.loadingPriority = action.payload
        },
        stopLoading: (state) => {
            state.isLoading = false
            state.loadingPriority = LoadingPriority.NONE
        },
        toggleDarkMode: (state) => {
            localStorage.setItem('darkMode', JSON.stringify(!state.isDarkMode))
            state.isDarkMode = !state.isDarkMode
        }
    }
})

export const {startLoading, stopLoading, toggleDarkMode} = uiSlice.actions
export default uiSlice.reducer