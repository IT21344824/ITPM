import React from 'react'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import "./ChatBot.scss";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
 // import { sendMsgToOpenAI } from './openai';


const ChatBot = () => {

    const [input , setInput] = useState("");

    const handleSent = async () => {
        // console.log(input);
        // const res = await sendMsgToOpenAI(input);
        // console.log(res);
    }


    return (
        <div className='ChatBot'>
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="main">
                    <div className="chats">
                        <div className="chat">
                            <AccountBoxIcon className='chatimg' /> <p className='txt'>  aaaaaaaaaaaaaaa</p>
                        </div>

                        <div className="chat bot">
                            <SmartToyIcon className='chatimg' /> <p className='txt'>  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque facilis, rerum distinctio consequuntur magni nam libero quo minima aliquid? Quis obcaecati, odio quibusdam, ex in accusamus nemo consequuntur debitis, rerum aliquid pariatur doloremque velit ipsum facere reprehenderit ut tempora explicabo omnis? Commodi sapiente beatae molestias modi repellat quod, est ratione voluptatibus dolores ipsam voluptatem accusamus, obcaecati omnis mollitia eos voluptates aliquid quis magnam? Eos quia sequi cumque qui? Eius quibusdam amet quae ipsam recusandae! Nihil modi hic quae corrupti, consectetur dignissimos alias fuga ut, doloribus id illo libero dicta tempora unde ab quam dolores magni delectus praesentium, incidunt voluptates eaque?</p>
                        </div>
                    </div>

                    <div className="chatFooter">
                        <div className="inp">
                            <input type='text' placeholder='send a massage' value={input} onChange={(e)=>{setInput(e.target.value)}}  /> 
                            <button className='send' onClick={handleSent}> sed </button>
                        </div>
                        <p>chat gpt may produce incorrect results</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatBot
