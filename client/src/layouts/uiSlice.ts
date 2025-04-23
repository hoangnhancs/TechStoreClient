import { createSlice } from "@reduxjs/toolkit";

const getInitDarkMode = () => {
    const storedDarkMode = localStorage.getItem('darkMode')
    return storedDarkMode ? JSON.parse(storedDarkMode) : false
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isLoading: false,
        isDarkMode: getInitDarkMode(),
    },
    reducers: {
        startLoading: (state) => {
            state.isLoading = true
        },
        stopLoading: (state) => {
            state.isLoading = false
        },
        toggleDarkMode: (state) => {
            localStorage.setItem('darkMode', JSON.stringify(!state.isDarkMode))
            state.isDarkMode = !state.isDarkMode
        }
    }
})

export const {startLoading, stopLoading, toggleDarkMode} = uiSlice.actions
export default uiSlice.reducer