import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './Disconnect.module.scss';
import cn from 'classnames';
import anime from 'animejs';
import { ICustomTweet } from '../../App';
export interface DisconnectProps {
  avatar?: string;
  name: string;
  onLogout?: (e: any) => Promise<void>;
  addCustomTweet: (x:any,newTweet:any) => any;
}
const EMPTY_FORM: ICustomTweet = {
  authorFullname: '',
authorUsername: '',
authorHash:'',
id: '',
time: '',
date: '',
text: '',
};
interface newTweet{
  authorFullname: string ,
  authorUsername: string ,
  authorHash?:string | undefined,
  id: string,
  time: string,
  date: string,
  text: string,
}

export const Disconnect: FC<DisconnectProps> = (props: DisconnectProps) => {
  const { avatar, name, onLogout,addCustomTweet } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [creationForm, setCreationForm] = useState<ICustomTweet>(EMPTY_FORM);
  const [isFocusButton, setFocusButton]=useState(false)
  const [inputValue, setInputValue]=useState('')
  const [id] = useState( Math.floor(Math.random() * 1_000_000));
  // const [tweet, setTweet] = useState({
  //   label,
  //   text: '',
  //   time: '',
  //   date:'',
  //   ipfs:'Stored in IPFS'
  // })
  const [testTweets, setTestTweets]= useState<newTweet[]>([])
 
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
  useEffect(()=>{},[isFocusButton,creationForm,inputValue,testTweets])
  const newVisible = (hash: string): string => {
    const firstFourCharacters = hash.substring(0, 5);
    const lastFourCharacters = hash.substring(hash.length - 0, hash.length - 5);
    return `${firstFourCharacters}...${lastFourCharacters}`;
  };
  const changeHandler = ( value: any) => {
  
    const date = new Date().toDateString();
    const data = new Date();
    const hour = data.getHours();
    const minutes = data.getMinutes();
    const newForm = Object.assign({}, creationForm);
    newForm.authorFullname='Галина Софронова'
    newForm.authorHash=name
    newForm.authorUsername='@lisofffa'
    newForm.date = date
    newForm.id = id.toString()
    newForm.text = value
    newForm.time =`${hour} : ${minutes}`
    if(value){
       setCreationForm(newForm)
    }
    // const newTweet = Object.assign({}, testTweets);
    testTweets?.push(newForm)
    // newTweet.authorFullname='Галина Софронова'
    // newForm.authorHash=name
    // newForm.authorUsername='@lisofffa'
    // newForm.date = date
    // newForm.id = id.toString()
    // newForm.text = value
    // newForm.time =`${hour} : ${minutes}`
   
      setTestTweets(testTweets)
    
   
    
  };
  console.log(typeof testTweets);
  
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
	  <div  className={styles.writeTweetWrapper}>
		<textarea onChange={(e)=>{setInputValue(e.target.value)}} onBlur={()=>{setFocusButton(false)}} onFocus={()=>{setFocusButton(true)}} spellCheck={false} placeholder='What’s happening?' className={styles.writeTweet}></textarea>
		<button className={cn(styles.sendTweet,{
      [styles.buttonSendFocus]:isFocusButton
    })} onClick={(e)=>{
      changeHandler(inputValue)
      addCustomTweet(e,creationForm)}}></button>
	  </div>
      <div className={styles.tweetsBlock}>
        <h2 className={styles.tweetTitle}>
          My decentralized tweets <span className={styles.tweetTitleLine}></span>
        </h2>
        {testTweets && testTweets.length>0  && testTweets.map((x, i) => (
          <div key={i} className={styles.itemWrapper}>
            <h3 className={styles.label}>{newVisible(x.authorHash!)}</h3>
            <div className={styles.desription}>{x.text}</div>
            <div className={styles.delimeterLine}></div>
            <div className={styles.info}>
              <span className={styles.time}>{x.time}</span>
              <span className={styles.delimeterDotted}></span>
              <span className={styles.date}>{x.date}</span>
              <span className={styles.delimeterDotted}></span>
              <span className={styles.ipfs}>Stored in IPFS</span>
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
