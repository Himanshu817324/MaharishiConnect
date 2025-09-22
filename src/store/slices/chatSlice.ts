import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
  timestamp: string;
};

type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  messages: Message[];
};

type ChatState = {
  chats: Chat[];
};

const initialState: ChatState = {
  chats: [
    {
      id: "1",
      name: "John Doe",
      lastMessage: "See you tomorrow!",
      messages: [
        { id: "m1", text: "Hello!", sender: "me", timestamp: "10:00 AM" },
        { id: "m2", text: "Hi, how are you?", sender: "other", timestamp: "10:05 AM" },
      ],
    },
    {
      id: "2",
      name: "Jane Smith",
      lastMessage: "Meeting at 5?",
      messages: [
        { id: "m3", text: "Sure!", sender: "me", timestamp: "09:00 AM" },
      ],
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: Message }>
    ) => {
      const chat = state.chats.find((c) => c.id === action.payload.chatId);
      if (chat) {
        chat.messages.push(action.payload.message);
        chat.lastMessage = action.payload.message.text;
      }
    },
  },
});

export const { sendMessage } = chatSlice.actions;
export default chatSlice.reducer;
