import { fetchMessages } from "../api";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  addMessagesAction,
} from "./actions";
import {
  REQUEST_MESSAGES,
  IS_FETCHING,
  ERROR_MESSAGE,
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
    yield put({ type: IS_NOT_FETCHING });
  } catch (e) {
    yield put({ type: ERROR_MESSAGE, payload: 'You are offline!' });
    yield put({ type: IS_NOT_FETCHING });
  }
}