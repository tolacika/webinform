import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "./store";
import { setLatestSubscribers, setSubscribersCount } from "./subscribersSlice";
import { type FormData, type Subscriber } from "./types.d";

const API_URL = "/api";

export function fetchData<T>(uri: string): Promise<T> {
  return new Promise((resolve, reject) => {
    fetch(API_URL + uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      })
      .catch(reject);
  });
};

export function postData<T>(uri: string, body: T, method: "POST" | "PUT" | "DELETE" = "POST"): Promise<{ success: boolean; message?: string }> {
  return new Promise((resolve, reject) => {
    fetch(API_URL + uri, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 409) {
            // Handle conflict error (duplicate email)
            return res.json().then(data => {
              resolve({ success: false, message: data.message || "Ez az email cím már fel van iratkozva!" });
            });
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch(error => {
        console.error("Error in postData:", error);
        reject(error);
      });
  });
}

export const fetchSubscribersCountThunk = createAsyncThunk<
  void,
  void,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  'fetch/fetchSubscribers',
  async (_, { dispatch }) => {
    const data = await fetchData<{ count: number }>("/count");
    dispatch(setSubscribersCount(data.count));
  }
);

export const fetchLatestSubscribersThunk = createAsyncThunk<
  void,
  void,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  'fetch/fetchLatestSubscribers',
  async (_, { dispatch }) => {
    const data = await fetchData<{ recent_subscribers: Subscriber[] }>("/recent");
    console.log("Fetched latest subscribers:", data);
    dispatch(setLatestSubscribers(data.recent_subscribers));
  }
);

export const subscribeThunk = createAsyncThunk<
  void,
  { name: string; email: string },
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>(
  'subscribe/subscribe',
  async ({ name, email }, { dispatch, rejectWithValue }) => {
    const response = await postData<FormData>("/subscribe", { name, email });
    if (!response.success) {
      return rejectWithValue(response.message || "Subscription failed");
    }
    console.log("Subscription successful");
   
    dispatch(fetchLatestSubscribersThunk());
    dispatch(fetchSubscribersCountThunk());
  }
);


export const unsubscribeThunk = createAsyncThunk<
  void,
  { email: string },
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>(
  'unsubscribe/unsubscribe',
  async ({ email }, { dispatch, rejectWithValue }) => {
    const response = await postData<{ email: string }>("/unsubscribe", { email }, "DELETE");
    if (!response.success) {
      return rejectWithValue(response.message || "Unsubscription failed");
    }
    console.log("Unsubscription successful");

    dispatch(fetchLatestSubscribersThunk());
    dispatch(fetchSubscribersCountThunk());
  }
);