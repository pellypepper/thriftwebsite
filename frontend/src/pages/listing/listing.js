import React, { useEffect , useState} from "react";
import Navbar from "../../component/navbar/navbar";
import "./listing.css";
import { useDispatch, useSelector } from 'react-redux';
import { getChatId, getCombineInfo } from '../../features/listSlice'; // Ensure correct path
import { getUsers, getMessages } from '../../features/chatSlice'; // Ensure correct path


export default function Listing({ userId }) {
    const dispatch = useDispatch();
    const { chatId, combineInfo, loading, error } = useSelector((state) => state.list); // Access Redux state
    const [message, setMessage] = useState(null)
      const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const fetchChatId = async () => {
            // Check if the user is signed in
         

            try {
                // Fetch user data (ensure correct response format)
                const buyerData = await dispatch(getUsers(userId)).unwrap();
        
                if (buyerData[0]?.id) {
                    // Dispatch getChatId with the user ID
                   await dispatch(getChatId(buyerData[0].id));
                
              
                }
            } catch (error) {
                console.error("Error fetching chat ID or user data:", error);
            }
        };

        fetchChatId();
    }, [dispatch, userId]);

    useEffect(() => {
        if (chatId.length > 0) {
       
          dispatch(getCombineInfo(chatId));
        }
      }, [chatId, dispatch]); 
      
      const handleViewChat = async(chatId) =>{
        console.log(combineInfo, 'combine')
 
                if(chatId){
                  const message =  await dispatch(getMessages(chatId)).unwrap()
                  console.log(message, 'message')
                  setMessage(message)
                } else{
                    setMessage(null);
                }
      }
      
      const handleInputChange = (e) => {
       
      };
    
      const handleSendMessage = async () => {
       
        }

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error}</p>;
    return (
        <main className="listing-main">
            <section className="listing">
                <Navbar />
            </section>

            <section className="listing-component">
                <div className="listing-grid">
                    <div className="message-container">
                        <h3>Messages</h3>
                        {combineInfo.map((prod) => (
                            <div  onClick={() => handleViewChat(prod.chat_id)}  className="message-listing" key={prod.chat_id}>
                                <div className="listing-icon">
                                    <img src={`path_to_image/${prod.image_url}`} alt={prod.name} />
                                </div>

                                <div className="listing-info">
                                    <h3>{prod.title}</h3>
                                    <p>{prod.message_text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="listing-chat">
                        <div className="listing-chat-container">
                           
                        {message ? (
                                <div className="listing-div-1">
                                  
                                    {message.length > 0 ? (
                                       <div className="message-split">
                                           <div className="listing-div-2">
                                            {message.map((msg) => (
                                                <div className="msg-list">
                                                    <p key={msg.message_id}>{msg.message_sender}: {msg.message_text}</p>
                                                    <p >{msg.timestamp}</p>
                                                </div>
                                            
                                            ))}
                                  
                                        </div>
                                                    <div className="listing-input-area">
                                                    <input
                                                      type="text"
                                                      placeholder="Type your message..."
                                                      value={''}
                                                      onChange={handleInputChange}
                                                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                      disabled={isSending}
                                                      className="message-input"
                                                    />
                                                    <button 
                                                      onClick={handleSendMessage} 
                                                
                                                      className="send-button"
                                                    >
                                                      {isSending ? 'Sending...' : 'Send'}
                                                    </button>
                                                  </div>
                                        </div>
                                    ) : (
                                        <p>No messages found for this chat.</p>
                                    )}
                                </div>
                            ) : (
                                <p>Select a chat to view messages.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
