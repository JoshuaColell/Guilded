import React from 'react';
import { useChat } from 'context';
import { useResolved } from 'hooks';
import { Loader } from 'semantic-ui-react';
import { ChatList, RailHeader } from 'components';

export const Sidebar = () => {
	const { myChats } = useChat();
	const chatsResolved = useResolved(myChats);

	return (
		<div className="sidebar">
			<RailHeader />
			{chatsResolved ? (
				<>
					{!!myChats.length ? (
						<div className="chat-list-container">
							<ChatList />
						</div>
					) : (
						<div className="chat-list-container no-chats-yet">
							<h3>No messages here yet...</h3>
						</div>
					)}
				</>
			) : (
				<div className="chats-loading">
					<Loader active size="huge" />
				</div>
			)}
		</div>
	);
};
