import React, { FC, useEffect, useState } from 'react';
import {} from '@dapplets/dapplet-extension';
import { bridge } from './dappletBridge';
import Bridge, { IDappStateProps } from '@dapplets/dapplet-overlay-bridge';
import { Login } from './components/Login';
import styles from './App.module.scss'
import cn from 'classnames'


 interface IStorage {
  likes: string[]
  counter: number
  link: string
  userAccount: string
}
export interface ICustomTweet{
  authorFullname: string
authorUsername: string
authorHash?: string
id: string
time: string
date: string
text: string
}
interface IBridge {
  login: () => Promise<void>
  logout: () => Promise<void>
  addCustomTweet: (ICustomTweet:ICustomTweet) => any;
}

const App = (props: IDappStateProps<IStorage>) => {
  const [isWaiting, setIsWaiting] = useState(false);

  const { sharedState } = props;
  const bridge = new Bridge<IBridge>();

  const handleLogIn = async (e: any) => {
    e.preventDefault();
    setIsWaiting(true);
    const res = await bridge.login();
    setIsWaiting(false);
  };

  const handleLogOut = async (e: any) => {
    e.preventDefault();
    setIsWaiting(true);
    const res = await bridge.logout();
    setIsWaiting(false);
  };
  const addTweet = async (e: any, newTweet:any) => {
    e.preventDefault();
    setIsWaiting(true);
    await bridge.addCustomTweet(newTweet);
    setIsWaiting(false);
  };

// addTweet()
  return sharedState && (
    <div className={styles.wrapper}>
      <Login
     
        name={sharedState.global?.userAccount}
        message="// Imagine a world where
        all deleted tweets can be recovered...
        And much more //"
        login={handleLogIn}
        logout={handleLogOut}
        disabled={isWaiting}
        loading={isWaiting}
        addCustomTweet={addTweet}
      />
    </div>
  );
}

export default App;


