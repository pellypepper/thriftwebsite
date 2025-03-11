// authSlice.test.js
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import authReducer, {
    setUser,
    setToken,
    clearAuth,
    fetchUserData,
    sendClerkDataToBackend
  } from './authSlice'; // Adjust the path if necessary
  
  describe('auth slice reducer', () => {
    const initialState = {
      user: null,
      token: null,
      loading: false,
      error: null,
      clerkSyncStatus: 'idle'
    };
  
    it('should return the initial state', () => {
      expect(authReducer(undefined, {})).toEqual(initialState);
    });
  
    describe('reducers', () => {
      it('should handle setUser', () => {
        const user = { id: '123', name: 'John Doe' };
        const nextState = authReducer(initialState, setUser(user));
        expect(nextState.user).toEqual(user);
        expect(nextState.loading).toBe(false);
      });
  
      it('should handle setToken', () => {
        const token = 'my-token';
        const nextState = authReducer(initialState, setToken(token));
        expect(nextState.token).toEqual(token);
      });
  
      it('should handle clearAuth', () => {
        const stateWithData = {
          user: { id: '123', name: 'John Doe' },
          token: 'my-token',
          loading: false,
          error: 'some error',
          clerkSyncStatus: 'succeeded'
        };
        const nextState = authReducer(stateWithData, clearAuth());
        expect(nextState.user).toBeNull();
        expect(nextState.token).toBeNull();
        expect(nextState.clerkSyncStatus).toEqual('idle');
      });
    });
  
    describe('extraReducers - fetchUserData', () => {
      it('should set loading to true when fetchUserData is pending', () => {
        const action = { type: fetchUserData.pending.type };
        const nextState = authReducer(initialState, action);
        expect(nextState.loading).toBe(true);
      });
  
      it('should set user and loading false when fetchUserData is fulfilled', () => {
        const user = { id: '123', name: 'John Doe' };
        const action = { type: fetchUserData.fulfilled.type, payload: user };
        // Start with a state where loading is true
        const stateLoading = { ...initialState, loading: true };
        const nextState = authReducer(stateLoading, action);
        expect(nextState.user).toEqual(user);
        expect(nextState.loading).toBe(false);
      });
  
      it('should set error and loading false when fetchUserData is rejected', () => {
        const error = 'Fetch failed';
        const action = { type: fetchUserData.rejected.type, error: { message: error } };
        const stateLoading = { ...initialState, loading: true };
        const nextState = authReducer(stateLoading, action);
        expect(nextState.error).toEqual(error);
        expect(nextState.loading).toBe(false);
      });
    });
  
    describe('extraReducers - sendClerkDataToBackend', () => {
      it('should set clerkSyncStatus to "loading" when sendClerkDataToBackend is pending', () => {
        const action = { type: sendClerkDataToBackend.pending.type };
        const nextState = authReducer(initialState, action);
        expect(nextState.clerkSyncStatus).toEqual('loading');
      });
  
      it('should set clerkSyncStatus to "succeeded" when sendClerkDataToBackend is fulfilled', () => {
        const action = { type: sendClerkDataToBackend.fulfilled.type };
        // Start with a state where clerkSyncStatus is "loading"
        const stateLoading = { ...initialState, clerkSyncStatus: 'loading' };
        const nextState = authReducer(stateLoading, action);
        expect(nextState.clerkSyncStatus).toEqual('succeeded');
      });
  
      it('should set clerkSyncStatus to "failed" and record error when sendClerkDataToBackend is rejected', () => {
        const error = 'Sync failed';
        const action = { type: sendClerkDataToBackend.rejected.type, error: { message: error } };
        const nextState = authReducer(initialState, action);
        expect(nextState.clerkSyncStatus).toEqual('failed');
        expect(nextState.error).toEqual(error);
      });
    });
  });
  