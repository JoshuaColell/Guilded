import { fb } from 'service';
import { createContext, useContext, useEffect, useState } from 'react';
import { newChat, leaveChat, deleteChat, getMessages } from 'react-chat-engine';

export const ChatContext = createContext();

export const ChatProvider = ({ children, authUser }) => {
	const [myChats, setMyChats] = useState();
	const [chatConfig, setChatConfig] = useState();
	const [selectedChat, setSelectedChat] = useState();

	function getRandomString(length) {
		var randomChars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-=+~';
		var result = '';
		for (var i = 0; i < length; i++) {
			result += randomChars.charAt(
				Math.floor(Math.random() * randomChars.length),
			);
		}
		return result;
	}

	const createChatRoomClick = () => {
		newChat(chatConfig, { title: `CHAT_ROOM_${getRandomString(12)}` });
		console.log(`CHAT_ROOM_${getRandomString(12)}`);
		console.log(`CHAT_ROOM_${getRandomString(12)}`);
	};

	const deleteChatClick = chat => {
		const isAdmin = chat.admin.username === chatConfig.userName;

		if (
			isAdmin &&
			window.confirm('Are you sure you want to delete this chat?')
		) {
			deleteChat(chatConfig, chat.id);
		} else if (
			!isAdmin &&
			window.confirm('Are you sure you want to leave this chat?')
		) {
			leaveChat(chatConfig, chat.id, chatConfig.userName);
		}
	};
	const selectChatClick = chat => {
		getMessages(chatConfig, chat.id, messages => {
			setSelectedChat({
				...chat,
				messages,
			});
		});
	};

	// Set the chat config once the
	// authUser has initialized.
	useEffect(() => {
		if (authUser) {
			fb.firestore
				.collection('chatUsers')
				.doc(authUser.uid)
				.onSnapshot(snap => {
					setChatConfig({
						userSecret: authUser.uid,
						avatar: snap.data().avatar,
						userName: snap.data().userName,
						projectID: process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID,
					});
				});
		}
	}, [authUser, setChatConfig]);

	return (
		<ChatContext.Provider
			value={{
				myChats,
				setMyChats,
				chatConfig,
				selectedChat,
				setChatConfig,
				setSelectedChat,
				selectChatClick,
				deleteChatClick,
				createChatRoomClick,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => {
	const {
		myChats,
		setMyChats,
		chatConfig,
		selectedChat,
		setChatConfig,
		setSelectedChat,
		selectChatClick,
		deleteChatClick,
		createChatRoomClick,
	} = useContext(ChatContext);

	return {
		myChats,
		setMyChats,
		chatConfig,
		selectedChat,
		setChatConfig,
		setSelectedChat,
		selectChatClick,
		deleteChatClick,
		createChatRoomClick,
	};
};
