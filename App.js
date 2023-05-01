import React, { useLayoutEffect } from "react";
import styled from "styled-components";
import Chat from "./components/Chat";
import Auth from "./components/Auth";
import { useDispatch, useSelector } from "react-redux";
import { setUserToStoreAction } from "./redux/actions";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const userFromStorage = localStorage.getItem("user");

  useLayoutEffect(() => {
    const user = JSON.parse(userFromStorage);
    user && dispatch(setUserToStoreAction(user));
  }, []);

  return (
    <SC.App>
      <SC.Container>
        {userFromStorage || user?.name ? <Chat /> : <Auth />}
      </SC.Container>
    </SC.App>
  );
}

const SC = {
  App: styled.div`
    height: 100vh;
    padding: 20px 10px;
    background-color: #b9d6f0;
  `,
  Container: styled.div`
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
  `,
};

export default App;
