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
        loadingCount: 0,
    },
    reducers: {
        startLoading: (state, action: PayloadAction<LoadingPriority>) => {
            const priority = action.payload;
            if (priority >= LoadingPriority.HIGH) {
                state.loadingCount = (state.loadingCount || 0) + 1;
                state.isLoading = true;
            }
            if (priority > state.loadingPriority) {
                state.loadingPriority = priority;
            }
        },
        stopLoading: (state, action: PayloadAction<LoadingPriority | undefined>) => {
            const priority = action.payload ?? LoadingPriority.HIGH;
            if (priority >= LoadingPriority.HIGH) {
                if (state.loadingCount > 0) {
                    state.loadingCount -= 1;
                }
            }
            if (state.loadingCount <= 0) {
                state.isLoading = false;
                state.loadingPriority = LoadingPriority.NONE;
                state.loadingCount = 0;
            }
        },
        toggleDarkMode: (state) => {
            localStorage.setItem('darkMode', JSON.stringify(!state.isDarkMode))
            state.isDarkMode = !state.isDarkMode
        }
    }
})

export const {startLoading, stopLoading, toggleDarkMode} = uiSlice.actions
export default uiSlice.reducer