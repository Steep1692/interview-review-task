import React, { useLayoutEffect } from "react";
import Chat from "./components/Chat";
import { Auth } from "@components";
import { useDispatch, useSelector } from "react-redux";
import { setUserToStoreAction } from "@actions";

function App() {
  const dispatch = useDispatch()
  
  const user = useSelector(({ app }) => app.user);
  const userStatus = useSelector(({ app }) => app.user.status);
  
  const userFromStorage = localStorage.getItem("user");

  useEffect(() => {
    const userFromStorageParsed = JSON.parse(userFromStorage)

    if (userFromStorageParsed !== undefined) {
      dispatch(setUserToStoreAction(userFromStorageParsed));
    }
  }, [userFromStorage, dispatch]);

  if (user) {
    return <Chat />;
  }

  return <Auth />;
}

export default App;
