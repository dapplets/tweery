import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './Disconnect.module.scss';
import cn from 'classnames';
import anime from 'animejs';
export interface DisconnectProps {
  avatar?: string;
  name: string;
  onLogout?: (e: any) => Promise<void>;
}
const testTweet = [
  {
    label: '0xc4E...C8F3E',
    text:
      'Ultricies bibendum non, non blandit libero, nulla feugiat in integer. Turpis at vestibulum rutrum laoreet egestas nunc.',
    time: '7:00 AM',
    date: 'Jul 14, 2022',
    ipfs: 'Stored in IPFS',
  },
];
export const Disconnect: FC<DisconnectProps> = (props: DisconnectProps) => {
  const { avatar, name, onLogout } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFocusButton, setFocusButton]=useState(false)
  useEffect(()=>{
    const init =()=>{
      anime({
        targets: wrapperRef.current,
        translateX: () => {
          return ['100%', '0%'];
        },
        easing: 'easeInOutSine'
      });
    }
    init()
    return ()=>{
     
    }
  },[])
  useEffect(()=>{},[isFocusButton])
  const newVisible = (hash: string): string => {
    const firstFourCharacters = hash.substring(0, 5);
    const lastFourCharacters = hash.substring(hash.length - 0, hash.length - 5);
    return `${firstFourCharacters}...${lastFourCharacters}`;
  };
  return (
    <div ref={wrapperRef} className={styles.wrapperDisconnect}>
      <div className={styles.bgline_top}></div>
	  <div className={styles.bgline_medium}></div>
      <div className={styles.logoutBlock}>
        {name && (
          <div className={cn(styles.name, name.length > 23 ? styles.h2 : styles.h1)}>
            <p className={styles.nameText}>{newVisible(name)}</p>
          </div>
        )}
        <button className={styles.buttonLogout} onClick={onLogout}>
          Log out
        </button>
      </div>
	  <div className={styles.writeTweetWrapper}>
		<textarea onBlur={()=>{setFocusButton(false)}} onFocus={()=>{setFocusButton(true)}} spellCheck={false} placeholder='What’s happening?' className={styles.writeTweet}></textarea>
		<button className={cn(styles.sendTweet,{
      [styles.buttonSendFocus]:isFocusButton
    })}></button>
	  </div>
      <div className={styles.tweetsBlock}>
        <h2 className={styles.tweetTitle}>
          My decentralized tweets <span className={styles.tweetTitleLine}></span>
        </h2>
        {testTweet.map((x, i) => (
          <div key={i} className={styles.itemWrapper}>
            <h3 className={styles.label}>{x.label}</h3>
            <div className={styles.desription}>{x.text}</div>
            <div className={styles.delimeterLine}></div>
            <div className={styles.info}>
              <span className={styles.time}>{x.time}</span>
              <span className={styles.delimeterDotted}></span>
              <span className={styles.date}>{x.date}</span>
              <span className={styles.delimeterDotted}></span>
              <span className={styles.ipfs}>{x.ipfs}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <div className={styles.counterBlock}>

          <span className={styles.counter}>162224 </span>
          <span className={styles.counterLabel}>tweets crawled</span>
        </div>
		<span className={styles.footerDelimeter}></span>
	
        <div className={styles.connectionBlock}>
        
          <span className={styles.connection}>IPFS Connection:</span>
          <span className={styles.connectionStatus}>
            Stable <span className={styles.connectionStatusLabel}></span>
          </span>
        </div>
        
      </div>
    </div>
  );
};
