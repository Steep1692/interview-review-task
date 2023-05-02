import { fetchMessages } from "@api";
import {
  addMessagesAction,
} from "@actions";
import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import {
  REQUEST_MESSAGES,
     IS_FETCHING,
  ERROR_MESSAGE,
  IS_NOT_FETCHING,
  ADD_MESSAGE,
  IS_NOT_SENDING,
  IS_SENDING,
} from "@types";

export function* sagaWatcher() {
  yield takeEvery(REQUEST_MESSAGES, getAllMessages);
  yield takeLatest(ADD_MESSAGE, sendMessage);
}

function* getAllMessages() {
  try {
    yield put({ type: IS_FETCHING });

    const messagesStored = yield JSON.parse(
      localStorage.getItem("messagesStored")
    );

    if (messagesStored) {
      yield put(addMessagesAction(messagesStored));
    } else {

      const payload = yield call(fetchMessages);
      const messages = yield payload.comments.map((item) => ({
        id: `${item.postId}${item.id}`,
        title: item.body,
        userName: item.user.username,
        userId: item.user.id,
        date: item.date,
      }));

      yield put(addMessagesAction(messages));
    }

    yield put({ type: IS_NOT_FETCHING });
  } catch (e) {
    yield put({ type: ERROR_MESSAGE, payload: 'You are offline!' });
    yield put({ type: IS_NOT_FETCHING });
  }
}

function* sendMessage(action) {
  try {
    yield put({ type: IS_SENDING });

    const user = yield select((state) => state.app.user);
    const message = {
      id: Math.random(),
      title: action.title,
      userName: user.name,
      userId: user.id,
      date: Date.now(),
    };

    const response = yield call(sendMessage, message);
    yield put(addMessagesAction([response.message]));

    yield put({ type: IS_NOT_SENDING });
  } catch (e) {
    yield put({ type: ERROR_MESSAGE, payload: 'You are offline!' });
    yield put({ type: IS_NOT_SENDING });
  }
}