// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
// import your reducers here
// import rootReducer from './reducers';


const store = configureStore({
  reducer: {
    // your reducers
  },
  // reducer: rootReducer,
});

export default store;