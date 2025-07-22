import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Subscriber } from "./types";
import type { RootState } from "./store";

export interface SubscribersState {
  latestSubscribers: Subscriber[];
  subscriberCount: number;
}

const initialState: SubscribersState = {
  latestSubscribers: [],
  subscriberCount: 0,
};

export const subscribersSlice = createSlice({
  name: "subscribers",
  initialState,
  reducers: {
    setLatestSubscribers: (state, action: PayloadAction<Subscriber[]>) => {
      state.latestSubscribers = action.payload;
    },
    setSubscribersCount: (state, action: PayloadAction<number>) => {
      state.subscriberCount = action.payload;
    }
  }
});

export const { setLatestSubscribers, setSubscribersCount } = subscribersSlice.actions;

export const selectLatestSubscribers = (state: RootState) => state.subscribers.latestSubscribers;
export const selectSubscriberCount = (state: RootState) => state.subscribers.subscriberCount;

export default subscribersSlice.reducer;