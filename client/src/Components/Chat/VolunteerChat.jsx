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

// Use environment variables for API keys
const apiKey = process.env.REACT_APP_STREAM_API_KEY;
const apiSecret = process.env.REACT_APP_STREAM_API_SECRET;

const VolunteerChat = () => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Initialize StreamChat client
        const chatClient = new StreamChat(apiKey, {
          enableInsights: true,
          enableWSFallback: true,
        });

        // Generate token for the user
        const userToken = chatClient.devToken("yash");

        // Connect the user
        await chatClient.connectUser(
          {
            id: "xyz", // User ID
            name: "xyz", // User name
            role: "admin", // Set user role (adjust if needed)
          },
          userToken
        );

        // Join an existing channel by its ID ("general-chat")
        const channel = chatClient.channel("messaging", "general-chat", {
          name: "General Chat", // Optional: You can update this if you want
          members: ["xyz"], // Optionally add the user to the members list
        });

        // Watch the channel to receive messages
        await channel.watch();

        // Set the client and channel states
        setClient(chatClient);
        setChannel(channel);
      } catch (error) {
        console.error("Chat initialization error:", error);
      }
    };

    initializeChat();

    // Cleanup when the component unmounts
    return () => {
      if (client) client.disconnectUser();
    };
  }, []); // Empty dependency array ensures this runs only once

  // If the client or channel is not initialized, show the loading indicator
  if (!channel || !client) return <LoadingIndicator />;

  // Render the chat interface once the channel and client are ready
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

export default VolunteerChat;
