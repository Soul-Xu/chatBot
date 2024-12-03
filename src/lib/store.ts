import { configureStore } from '@reduxjs/toolkit'
import { urlSlice } from './features/slices/urlSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      currentUrl: urlSlice.reducer,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']