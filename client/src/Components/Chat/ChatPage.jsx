import { StreamChat } from "stream-chat";
import { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  ChannelHeader,
  LoadingIndicator,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = process.env.REACT_APP_STREAM_API_KEY;
const apiSecret = process.env.REACT_APP_STREAM_API_SECRET;

const ChatPage = () => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const chatClient = new StreamChat(apiKey, {
          enableInsights: true,
          enableWSFallback: true,
        });

        const userToken = chatClient.devToken("yash");

        await chatClient.connectUser(
          {
            id: "xyz",
            name: "xyz",
            role: "admin",
          },
          userToken
        );

        // Create channel with explicit permissions
        const channel = chatClient.channel("messaging", "general-chat", {
          name: "General Chat",
          created_by: { id: "xyz" },
          members: ["xyz"],
        });

        await channel.create();
        await channel.watch();

        setClient(chatClient);
        setChannel(channel);
      } catch (error) {
        console.error("Chat initialization error:", error);
      }
    };

    initializeChat();

    return () => {
      if (client) client.disconnectUser();
    };
  }, []);

  if (!channel || !client) return <LoadingIndicator />;

  return (
    <Chat client={client} theme="messaging dark">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default ChatPage;
