import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IWebStateSlice {
  isLoader: boolean;
  isNavbarLoad: boolean;
  isMainPageLoad: boolean;
  recommedLoadPool: string[];
  currentPage: string;
  isInformationPopUp: boolean;
  currentLanguage: string;
  sessionId: string;
  currentUserActive: number;
  currentPageKey: string;
}

const initialState: IWebStateSlice = {
  isLoader: false,
  isNavbarLoad: false,
  isMainPageLoad: false,
  isInformationPopUp: false,
  recommedLoadPool: [],
  currentPage: "หน้าหลัก",
  currentLanguage: "TH",
  sessionId: "",
  currentUserActive: 0,
  currentPageKey: "homepage",
};

export const webstateSlice = createSlice({
  name: "webstate",
  initialState,
  reducers: {
    openLoader: (state: IWebStateSlice) => {
      state.isLoader = true;
    },
    closeLoader: (state: IWebStateSlice) => {
      state.isLoader = false;
    },
    setCurrentActiveUser: (
      state: IWebStateSlice,
      actions: PayloadAction<number>,
    ) => {
      state.currentUserActive = actions.payload;
    },
    setCurrentPage: (state: IWebStateSlice, actions: PayloadAction<string>) => {
      state.currentPage = actions.payload;
    },
    setCurrentPageKey: (
      state: IWebStateSlice,
      actions: PayloadAction<string>,
    ) => {
      state.currentPageKey = actions.payload;
    },
    setSessionId: (state: IWebStateSlice, actions: PayloadAction<string>) => {
      state.sessionId = actions.payload;
    },
    setNavbarLoaded: (state: IWebStateSlice) => {
      if (state.isNavbarLoad) {
        return;
      }
      state.isNavbarLoad = true;
    },
    setMainPageLoaded: (state: IWebStateSlice) => {
      if (state.isMainPageLoad) {
        return;
      }
      state.isNavbarLoad = true;
    },
    setIsRecommendPool: (
      state: IWebStateSlice,
      actions: { payload: string },
    ) => {
      if (state.recommedLoadPool.includes(actions.payload)) {
        return;
      }
      state.recommedLoadPool = [...state.recommedLoadPool, actions.payload];
    },
    openInformation: (state: IWebStateSlice) => {
      state.isInformationPopUp = true;
    },
    setLanguage: (state: IWebStateSlice, actions: { payload: string }) => {
      state.currentLanguage = actions.payload;
    },
  },
});

export const { closeLoader, openLoader } = webstateSlice.actions;

export default webstateSlice.reducer;
