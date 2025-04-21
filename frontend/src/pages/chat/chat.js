import React, { useEffect,useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import './chat.css';
import { useLocation } from "react-router-dom";
import Navbar from '../../component/navbar/navbar';
import { createChat, sendMessage, getMessages, getUsers } from '../../features/chatSlice';

const socket = io(process.env.REACT_APP_API_URL);

export default function ChatPage({ buyerId }) {
  const location = useLocation();
  const product = location.state?.product;
  const messagesEndRef = useRef(null);
  const productId = product.id;
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.chat || {});
  const [newMessage, setNewMessage] = useState('');
  const sellerId = product.clerk_id;
  const [chatDat, setChatDat] = useState(null);
  const [userId, setUserId] = useState(null);
  const [sellerUserId , setSellerUserId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [productDetails, setProductDetails] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Create chat when component mounts
  useEffect(() => {
    const fetchUsersAndCreateChat = async () => {
      if (buyerId === sellerId) {
        return alert('You cannot chat with yourself');
      } else if (buyerId && sellerId && productId) {
        try {
          // Dispatch getUsers for both buyer and seller
          const buyerData = await dispatch(getUsers(buyerId)).unwrap();
          const sellerData = await dispatch(getUsers(sellerId)).unwrap();
  
          setProductDetails({
            title: product.title,
            price: product.price,
            image: product.image_url,
          });
  
          // Now that we have both buyer and seller data, create the chat
          const chatData = await dispatch(createChat({
            buyer_id: buyerData[0].id,
            seller_id: sellerData[0].id,
            product_id: productId,
          })).unwrap();
  
          setUserId(buyerData[0].id);
          setSellerUserId(sellerData[0].id);
          setChatDat(chatData.chat_id); // Set chat id to state
      
  
          socket.emit('join-chat', chatData.chat_id);
         
        } catch (error) {
          console.error("Error fetching users or creating chat:", error);
        }
      }
    };
  
    fetchUsersAndCreateChat();
  
    return () => {
      if (chatDat) {
        socket.emit('leave-chat', chatDat);
      
      }
    };
  }, [buyerId, sellerId, productId, product.image_url, product.price, product.title, dispatch, chatDat, sellerUserId]);
  
  // Fetch messages when chatId is updated
  useEffect(() => {
    const fetchMessages = async () => {
      if (chatDat) {
        try {
          const chatMessages = await dispatch(getMessages(chatDat)).unwrap();
          setChatMessages(chatMessages); // Set messages when chat id is available
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();
  }, [chatDat, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);



    useEffect(() => {
        if (chatDat) {
          const handleNewMessage = async (message) => {
           
            if (message.chat_id === chatDat) {
              try {
                const newChatMessages = await dispatch(getMessages(chatDat)).unwrap();
                setChatMessages(newChatMessages);
              } catch (error) {
                console.error('Error fetching new messages:', error);
              }
            }
          };
    
          socket.on('new-message', handleNewMessage);
          socket.on('typing', (data) => {
            // Handle typing indicator if needed
          });
          
          return () => {
            socket.off('new-message', handleNewMessage);
            socket.off('typing');
          };
        }
      }, [chatDat, dispatch]);

    
      
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (chatDat && userId) {
      socket.emit('typing', { chat_id: chatDat, user_id: userId });
    }
  };

  const handleSendMessage = async () => {
    if (chatDat && userId && newMessage.trim()) {
      try {
        const senderType = userId === sellerUserId ? "Seller" : "Buyer";
 
        
        const messageData = {
          chat_id: chatDat,
          sender_id: userId,
          message_text: newMessage,
          message_sender: senderType
        };
        

       
        
        
        const result = await dispatch(sendMessage(messageData)).unwrap();
      
        // Emit via socket if needed
        socket.emit('send-message', messageData);
        

        setNewMessage('');

        const updatedMessages = await dispatch(getMessages(chatDat)).unwrap();
        setChatMessages(updatedMessages);
      } catch (error) {
        console.error('Error in handleSendMessage:', error);
      
      }
    }
  };


  return (
    <main>
      <section>
        <Navbar />
      </section>

      <section className="chat-section">
        <div className="chat-page">
          <div className="chat-header">
            {productDetails && (
              <div className="product-info">
                <div className="product-images">
                  {productDetails.image && <img src={productDetails.image} alt={productDetails.title} />}
                </div>
                <div className="product-details">
                  <h3>{productDetails.title}</h3>
                  <p className="product-price">${productDetails.price}</p>
                </div>
              </div>
            )}
            <h2>Chat with {userId === sellerUserId ? 'Buyer' : 'Seller'}</h2>
          </div>

          <div className="chat-container">
            <div className="messages-area">
              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : chatMessages.length === 0 ? (
                <div className="no-messages">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="messages-list">
                {chatMessages.map((msg, index) => {
          const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
          return (
            <div 
              key={index} 
              className={`message-bubble ${msg.sender_id === userId ? 'sent' : 'received'}`}
            >
              <p className="message-text">
                <strong>{msg.message_sender}:</strong> {msg.message_text}
              </p>
              <p className="timestamp">{formattedTime}</p>
            </div>
          );
        })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="input-area">
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
                disabled={isSending || !newMessage.trim()}
                className="send-button"
              >
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </div>
            {error && <p className="error-message">Error: {error}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}