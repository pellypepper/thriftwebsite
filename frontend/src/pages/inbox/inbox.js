import React, { useEffect , useState} from "react";
import Navbar from "../../component/navbar/navbar";
import "./inbox.css";
import { useDispatch, useSelector } from 'react-redux';
import { getChatId, getCombineInfo } from '../../features/inboxSlice'; // Ensure correct path
import { getUsers, getMessages , sendMessage, deleteMessages} from '../../features/chatSlice'; // Ensure correct path
import { io } from 'socket.io-client';




const socket = io(process.env.REACT_APP_API_URL);

export default function Inbox({ userId }) {
    const dispatch = useDispatch();
    const { chatId, combineInfo, loading, error } = useSelector((state) => state.inbox); 
    const [message, setMessage] = useState(null)
    const [newMessage, setNewMessage] = useState('')
      const [isSending, setIsSending] = useState(false);
      const [currentChatId , setCurrentChatId] = useState('')
      const [sellerUserId, setSellerUserId] = useState('')
      const [updatedCombine, setUpdatedCombine] = useState([])
      const [user , setUser]= useState('')

    useEffect(() => {
        const fetchChatId = async () => {
    
        if(!userId) {
            return 'signin to continue'
        }

            try {
                // Fetch user data (ensure correct response format)
                const buyerData = await dispatch(getUsers(userId)).unwrap();
                setUser(buyerData[0].id)
                if (buyerData[0]?.id) {
                    // Dispatch getChatId with the user ID
                   await dispatch(getChatId(buyerData[0].id));
                
                  
                } else {
                    alert('you need to login')
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
      useEffect(() => {
        setUpdatedCombine(combineInfo, 'newcombine')
    
      }, [currentChatId, combineInfo]);
      
      const handleViewChat = async(chat_id, sellerId) =>{


                if(chat_id){
                  const message =  await dispatch(getMessages(chat_id)).unwrap()
           
                  setMessage(message)
                  setCurrentChatId(chat_id)
                  setSellerUserId(sellerId)
                  
                  
                } else{
                    setMessage(null);
                }
      }
      
      const handleInputChange = (e) => {
        setNewMessage(e.target.value);
     
        if (currentChatId && user) {
          socket.emit('typing', { chat_id: currentChatId, user_id: user });
        }
      };
    
      const handleSendMessage = async () => {
   
            
                 
               
          if (currentChatId && user && newMessage.trim()) {

             try {
               const senderType = user === sellerUserId ? "Seller" : "Buyer";
        
               
               const messageData = {
                 chat_id: currentChatId,
                 sender_id: user,
                 message_text: newMessage,
                 message_sender: senderType
               };
               
       
              
               
               
                await dispatch(sendMessage(messageData)).unwrap();
   
           
               // Emit via socket if needed
               socket.emit('send-message', messageData);
               
           
               setNewMessage('');
       
               const updatedMessages = await dispatch(getMessages(currentChatId)).unwrap();
            
               setMessage(updatedMessages);
              
             } catch (error) {
               console.error('Error in handleSendMessage:', error);
             
             }
           }
        }
        const handleDelete = async (chat) => {
           
            if (!chat) {
              return 'No chat ID found';
            }

          
            // Dispatch the deleteMessages async action
            await dispatch(deleteMessages(chat));
            const filter = updatedCombine.filter( prev => prev.chat_id !== chat)
            setUpdatedCombine(filter)

            const updatedCombineInfo = chatId.filter(prev => prev !== chat);
          
            dispatch(getCombineInfo(updatedCombineInfo));
          };
          

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
                        {updatedCombine.length > 0 ?   (
                            <div>
                                {updatedCombine.map((prod) => (
                            <div  onClick={() => handleViewChat(prod.chatId, prod.sellerId)}  className="message-listing" key={prod.chatId}>
                                <div className="listing-icon">
                                    <img src={`${prod.image_url}`} alt={prod.name} />
                                </div>

                                <div className="listing-info">
                                    <h6>{prod.title}</h6>
                                    <p>{prod.message_text}</p>
                                </div>
                                <button onClick={()=> handleDelete(prod.chatId)}> {loading ? 'Deleting...' : 'Delete'}</button>
                          
                            </div>
                        ))}
                            </div>
                        ) : (
                            <p> No Active Message</p>
                        )}
                    </div>

                    <div className="listing-chat">
                        <div className="listing-chat-container">
                           
                        {message ? (
                                <div className="listing-div-1">
                                  
                                    {message.length > 0 ? (
                                       <div className="message-split">
                                           <div className="listing-div-2">
                                           {message.length > 0 ? (
  <div className="message-split">
    <div className="listing-div-2">
      {message.map((msg) => {
        const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

        return (
          <div
            className={`message-bubble ${msg.sender_id === user ? 'sent' : 'received'}`}
            key={msg.message_id}
          >
            <p className="message-text">
              <strong>{msg.message_sender}:</strong> {msg.message_text}
            </p>
            <p className="timestamp">{formattedTime}</p>
          </div>
        );
      })}
    </div>
  </div>
) : null}

                                  
                                        </div>
                                                    <div className="listing-input-area">
                                                    <input
                                                      type="text"
                                                      placeholder="Type your message..."
                                                      value={newMessage}
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
