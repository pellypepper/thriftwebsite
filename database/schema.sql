-- Table to store users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,               -- Auto-incrementing ID
    clerk_id TEXT NOT NULL,               -- Clerk ID associated with the user
    username VARCHAR(100) NOT NULL UNIQUE, -- Username, unique and not null
    email VARCHAR(255) NOT NULL UNIQUE,    -- Email, unique and not null
    firstname VARCHAR(100),               -- First name of the user
    lastname VARCHAR(100),                -- Last name of the user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the record was created
);

-- Table to store items for sale
CREATE TABLE items (
    id SERIAL PRIMARY KEY,               -- Auto-incrementing ID
    title VARCHAR(255) NOT NULL,          -- Title with a max length of 255 characters
    price DECIMAL(10, 2) NOT NULL,        -- Price with 10 digits, 2 decimal places
    description TEXT,                     -- Description, can hold longer text
    condition VARCHAR(100),               -- Condition (e.g., 'new', 'used', etc.)
    location VARCHAR(255),                -- Location of the item
    category VARCHAR(100),                -- Category of the item (e.g., 'electronics', 'furniture')
    main_category VARCHAR(100),          -- Main category of the item (e.g., 'electronics', 'furniture')
    image_url TEXT NOT NULL,               -- URL for the item's image
    clerk_id TEXT NOT NULL,               -- ID of the clerk responsible for the item
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the record was created
    available BOOLEAN DEFAULT TRUE         -- Availability of the item
);

-- Table to store chats between users
CREATE TABLE chats (
  chat_id SERIAL PRIMARY KEY,           -- Auto-incrementing chat ID
  buyer_id INT NOT NULL,                -- ID of the buyer (user)
  seller_id INT NOT NULL,               -- ID of the seller (user)
  item_id INT NOT NULL,                 -- ID of the item being discussed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the chat was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the chat was last updated
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE, -- Reference to buyer
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE, -- Reference to seller
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE -- Reference to item
);

-- Table to store messages in each chat
CREATE TABLE messages (
  message_id SERIAL PRIMARY KEY,      -- Auto-incrementing message ID
  chat_id INT NOT NULL,               -- ID of the chat to which the message belongs
  sender_id INT NOT NULL,             -- ID of the sender (either buyer or seller)
  message_text TEXT NOT NULL,         -- Content of the message
  message_sender TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the message was sent
  FOREIGN KEY (chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE, -- Reference to chat
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE -- Reference to sender (user)
);
