"use client";
import { Provider } from "react-redux";
import {store, persistor} from "./store";
import Header from "../_components/Header/Header";
import { PersistGate } from "redux-persist/integration/react";
import Footer from "../_components/Footer/Footer"

export const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Header />
        {children}
        <Footer />
      </PersistGate>
    </Provider>
  );
};
