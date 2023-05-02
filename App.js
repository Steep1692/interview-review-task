import React, { useLayoutEffect } from "react";
import Chat from "./components/Chat";
import { Auth } from "@components";
import { useDispatch, useSelector } from "react-redux";
import { setUserToStoreAction } from "@actions";

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.app.user);
  const userFromStorage = localStorage.getItem("user");

  useLayoutEffect(() => {
    const user = JSON.parse(userFromStorage)
    user && dispatch(setUserToStoreAction(user));
  }, []);

  if (userFromStorage || user?.name) {
    return <Chat />;
  }

  return <Auth />;
}

export default App;
