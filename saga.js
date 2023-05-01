import { call, put, takeEvery, delay } from "redux-saga/effects";
import { fetchMessages } from "../api";
import {
  addMessagesAction,
} from "./actions";
import {
  REQUEST_MESSAGES,
  IS_ONLINE,
  IS_OFFLINE,
  IS_FETCHING,
  IS_NOT_FETCHING,
} from "./types";

export function* sagaWatcher() {
  yield takeEvery(REQUEST_MESSAGES, getMessages);
}

function* getMessages() {
  try {
    const countMessages = yield JSON.parse(
      localStorage.getItem("countMessages")
    );
    yield put({ type: IS_FETCHING });
    const payload = yield call(fetchMessages, countMessages);
    const messages = yield payload.comments.map((item) => ({
      id: `${item.postId}${item.id}`,
      title: item.body,
      userName: item.user.username,
      userId: item.user.id,
    }));
    yield put(addMessagesAction(messages));
    yield call(addMessagesToLocalStorage, messages);
    yield call(
      setValueToLocalStorage,
      "countMessages",
      JSON.stringify(+countMessages + messages.length)
    );
    yield put({ type: IS_NOT_FETCHING });
  } catch (e) {
    yield put({ type: IS_OFFLINE });
    yield delay(2000);
    yield put({ type: IS_ONLINE });
    yield put({ type: IS_NOT_FETCHING });
  }
}

const addMessagesToLocalStorage = (messages) => {
  const storageMessages = JSON.parse(localStorage.getItem("messages")) || [];
  localStorage.setItem(
    "messages",
    JSON.stringify([...storageMessages, ...messages])
  );
};

const setValueToLocalStorage = (property, value) =>
  localStorage.setItem(property, value);