import React, { FC, useEffect, useState } from 'react';
import {} from '@dapplets/dapplet-extension';
import { bridge } from './dappletBridge';
import Bridge, { IDappStateProps } from '@dapplets/dapplet-overlay-bridge';
import { Login } from './components/Login';
import styles from './App.module.scss';
import cn from 'classnames';

interface IStorage {
  likes: string[];
  counter: number;
  link: string;
  userAccount: string;
}
export interface ICustomTweet {
  authorFullname: string;
  authorUsername: string;
  authorHash?: string;
  id: string;
  time: string;
  date: string;
  text: string;
}
interface IBridge {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  addCustomTweet: (authorUsername: string, ICustomTweet: ICustomTweet) => Promise<void>;
  fetchCustomTweets(authorUsername: string): Promise<ICustomTweet[]>;
}

const App = (props: IDappStateProps<IStorage>) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [cusomTweets, setCustomTweets] = useState<ICustomTweet[]>();
  const { sharedState } = props;
  const bridge = new Bridge<IBridge>();
  useEffect(() => {
    const init = async () => {
      const res = await bridge.fetchCustomTweets('lisofffa');
      if (res) {
        setCustomTweets(res);
      }
    };
    init();
    return () => {};
  }, []);

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
  const addTweet = async (e: any, newTweet: any) => {
    e.preventDefault();
    if (!newTweet) return;
    console.log(newTweet);
    
    setIsWaiting(true);
    // const res =  await bridge.addCustomTweet('lisofffa',newTweet)
    setIsWaiting(false);
  };
  const getTweet = async () => {
    setIsWaiting(true);
    const res = await bridge.fetchCustomTweets('lisofffa');

    setIsWaiting(false);

    return res;
  };

  return (
    sharedState && (
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
          fetchCustomTweets={getTweet}
          cusomTweets={cusomTweets}
        />
      </div>
    )
  );
};

export default App;
