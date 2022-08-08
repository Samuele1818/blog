---
slug: react redux persistor dark mode
title: Setup a website with React, React Redux, Redux Persist and Dark Mode
authors: [ss]
url: https://github.com/wgao19
image_url: https://github.com/wgao19.png
tags: [react, redux, redux-persist]
---

In this article we will explore how to create a simple website and implement a dark mode system with react, redux and
redux persist.

<!--truncate-->

:::note

We can use [context](https://it.reactjs.org/docs/context.html) instead of redux if we don't need to use redux in our
website.
Context is useful if you are building a simple website, and so you don't have to handle complex states.

:::

:::info Requirements

1. [x] [React](https://it.reactjs.org/)
2. [x] [React Redux](https://react-redux.js.org/)
3. [x] [React Redux Persist](https://github.com/rt2zz/redux-persist)

:::

## Install Dependencies

So let start, first of all we need to install dependencies in our react project:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="npm" label="npm">

```npm
npm install @reduxjs/toolkit react-redux redux-persist 
```

</TabItem>
<TabItem value="yarn" label="yarn">

```yarn
yarn add @reduxjs/toolkit react-redux redux-persist
```

</TabItem>
</Tabs>

:::caution If you are using Nextjs

<Tabs>
<TabItem value="npm" label="npm">

```npm
npm install next-redux-wrapper
```

</TabItem>
<TabItem value="yarn" label="yarn">

```yarn
yarn add next-redux-wrapper
```

</TabItem>
</Tabs>

:::

## Setup React Redux

### Implement Storage

<Tabs>
<TabItem value="react" label="React">

```jsx title="/src/redux/store.ts"
import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit'
import themeReducer from "./slices/theme"; //Will create this in a moment
import storage from 'redux-persist/lib/storage'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage,
}

const combinedReducer = combineReducers({
  theme: themeReducer,
})

const reducer = (
  state: ReturnType<typeof combinedReducer>,
  action: AnyAction
) => {
  if (action.type === HYDRATE)
    return {
      ...state, // use previous state
    }
  else return combinedReducer(state, action)
}

const persistedReducer = persistReducer(
  persistConfig,
  reducer,
)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
})
store.__persistor = persistStore(store)

type
Store = ReturnType < typeof makeStore >

export
type
AppDispatch = Store['dispatch']
export
type
RootState = ReturnType < Store['getState'] >
export
type
AppThunk < ReturnType = void > = ThunkAction <
  ReturnType,
  RootState,
  unknown,
Action < string >
>

export { store }

```

</TabItem>
<TabItem value="nextjs" label="NextJs">

```jsx title="/src/redux/store.ts"
import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit'
import themeReducer from "./slices/theme"; //Will create this in a moment
import storage from 'redux-persist/lib/storage'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import { notificationsSlice } from "./slices/notificationsSlice";

const persistConfig = {
  key: 'root',
  storage,
}

const combinedReducer = combineReducers({
  theme: themeReducer,
})

const reducer = (
  state: ReturnType<typeof combinedReducer>,
  action: AnyAction
) => {
  if (action.type === HYDRATE)
    return {
      ...state, // use previous state
    }
  else return combinedReducer(state, action)
}

const persistedReducer = persistReducer(
  persistConfig,
  reducer,
)

let store

export const makeStore: any = ({ isServer }) => {
  if (isServer)
    //If it's on server side, create a store
    return configureStore({
      reducer: combinedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            // Ignore these paths in the state
            ignoredActions: [
              FLUSH,
              REHYDRATE,
              PAUSE,
              PERSIST,
              PURGE,
              REGISTER,
            ]
          },
        }),
    })
  
  store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
          ],
        },
      }),
  })
  store.__persistor = persistStore(store)
  return store
}

type
Store = ReturnType < typeof makeStore >

export
type
AppDispatch = Store['dispatch']
export
type
RootState = ReturnType < Store['getState'] >
export
type
AppThunk < ReturnType = void > = ThunkAction <
  ReturnType,
  RootState,
  unknown,
Action < string >
>

export { store }

export const wrapper = createWrapper(makeStore, {
  debug: false,
})
```

</TabItem>
</Tabs>

### Create Theme Reducer

```jsx title="/src/redux/slices/theme.ts"
import { createSlice } from '@reduxjs/toolkit'

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDarkMode: false,
  },
  reducers: {
    toggleDarkMode: (state, { payload }) => {
      state.isDarkMode = payload
    },
  },
})

export const { toggleDarkMode } = themeSlice.actions

export default themeSlice.reducer
```

### Init Redux

<Tabs>
<TabItem value="react" label="React">

```jsx title="/src/index.ts"
import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import { store } from './store'

import App from './App'

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App/>
  </Provider>
)
```

</TabItem>

<TabItem value="nextjs" label="NextJs">

```jsx title="/src/pages/_app.ts"
import { AppProps } from 'next/app'
import { store, wrapper } from './store'

const App = ({ Component, pageProps }: AppProps) => {
  
  return (
    <PersistGate
      loading={<p>Loading</p>}
      persistor={store.__persistor}>
      <Component {...pageProps} />
    </PersistGate>
  )
}

export default wrapper.withRedux(App)
```

</TabItem>
</Tabs>

### Add hooks for Typescript user

```jsx title="/src/redux/hooks.ts"
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux'
import { AppDispatch, RootState } from './store'

export const useAppDispatch = () =>
  useDispatch < AppDispatch > ()
export const useAppSelector: TypedUseSelectorHook<RootState> =
  useSelector
```

:::info Using with TailwindCss

If you are using TailwindCss or something that work similarly, you need to add this piece of code

<Tabs>
<TabItem value="react" label="React">

```jsx title="/src/App.ts"
import { useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from './store'

const App = () => {
  const isDarkMode = useAppSelector(
    (state) => state.theme.isDarkMode
  )
  const dispatch = useAppDispatch()
  
  // When DarkMode is REHYDRATE from storage, update classlist
  // https://stackoverflow.com/questions/72690224/react-redux-persist-dispatch-an-action-after-rehydrate
  useLayoutEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDarkMode])
  
  return (
    <></>
  )
}

export default App
```

</TabItem>

<TabItem value="nextjs" label="NextJs">

```jsx title="/src/pages/_app.ts"
import { AppProps } from 'next/app'
import { store, wrapper } from './store'
import { useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from './hooks'

const App = ({ Component, pageProps }: AppProps) => {
  const isDarkMode = useAppSelector(
    (state) => state.theme.isDarkMode
  )
  const dispatch = useAppDispatch()
  
  // When DarkMode is REHYDRATE from storage, update classlist
  // https://stackoverflow.com/questions/72690224/react-redux-persist-dispatch-an-action-after-rehydrate
  useLayoutEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDarkMode])
  
  return (
    <PersistGate
      loading={<p>Loading</p>}
      persistor={store.__persistor}>
      <Component {...pageProps} />
    </PersistGate>
  )
}

export default wrapper.withRedux(App)
```

</TabItem>
</Tabs>

:::

## Conclusions

So we have learned how to integrate a dark mode system using React, React Redux, Redux Persist and
eventually [NextJs](https://nextjs.org/) and [TailwindCss](https://tailwindcss.com/).
