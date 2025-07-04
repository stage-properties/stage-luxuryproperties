import { configureStore, combineReducers } from "@reduxjs/toolkit";
import currencyReducer from "./currencySlice/currencySlice";
import areaUnitReducer from "./areaUnitSlice/areaUnitSlice";
import searchResultFilter from "./searchResultSlice/searchResultSlice"
import featuredOffplanProperty from "./FeaturedOffplanPropertySlice/featuredOffplanPropertySlice";
import allTeams from "./team/allTeamsSlice";
import contactModalReducer from "./contactModal/contactModalSlice";
import langSwitcherVisibility from './langCurrSwitcherVisibility/langCurrSwitcherVisibilitySlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// 1. Create a root reducer
const rootReducer = combineReducers({
  currency: currencyReducer,
  langSwitcherVisibility: langSwitcherVisibility,
  areaUnit: areaUnitReducer,
  searchResultFilter:searchResultFilter,
  featuredOffplanProperty:featuredOffplanProperty,
  allTeams,
  contactModalRedux:contactModalReducer
  // Add other reducers here
});

// 2. Configure persist settings
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["currency", "areaUnit"], // Specify which slices to persist
};

// 3. Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist requires certain actions to be ignored in serializable checks
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Create a persistor
export const persistor = persistStore(store);