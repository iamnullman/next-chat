import UserSidebar from "components/Users";
import { useConnection } from "context/connect";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Room() {
    const router = useRouter();
    let [room, setRoom] = useState(null);
    let [members, setMembers] = useState([]);
    let [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const { connection } = useConnection();

    useEffect(() => {
        if (connection) {
            connection.off('message').on('message', data => {
                setMessages(messages => [...messages, data]);
            });

            return () => {
                connection.off('message', data => {
                    setMessages(messages => [...messages, data]);
                });
            }
        }
    }, [connection]);

    useEffect(() => {
        if (connection) {
            const fetchRoomListener = data => {
                if (!data.success) router.push('/rooms');
                setRoom(data.data);
            }
            const roomMembersListener = data => {
                if (!data.success) router.push('/rooms');
                setMembers(data.data);
            }

            connection.emit('roomMembers');
            connection.on('roomMembers', roomMembersListener);

            connection.emit('fetchRoom');
            connection.on('fetchRoom', fetchRoomListener);

            return () => {
                connection.off('roomMembers', roomMembersListener);
                connection.off('fetchRoom', fetchRoomListener);
            }
        }
    }, [connection, router]);

    const LeaveRoom = () => {
        connection.emit('leaveRoom');
        connection.on('leaveRoom', data => {
            if (data.success) {
                router.push('/rooms');
            }
        });
    }

    const dateNow = date => {
        const now = new Date();
        const msgDate = new Date(date);
        if (now - msgDate < 1000 * 60) {
            if (Math.floor((now - msgDate) / 1000) === 1) {
                return Math.floor((now - msgDate) / 1000) + ' seconds ago';
            } else {
                return 'now';
            }
        }
        else if (now.getDate() === msgDate.getDate() && now.getMonth() === msgDate.getMonth() && now.getFullYear() === msgDate.getFullYear()) {
            const diff = now.getTime() - msgDate.getTime();
            const minutes = Math.floor(diff / 1000 / 60);
            return `${minutes} minutes ago`;
        }
        else if (now.getDate() === msgDate.getDate() && now.getMonth() === msgDate.getMonth() && now.getFullYear() === msgDate.getFullYear()) {
            const diff = now.getTime() - msgDate.getTime();
            const hours = Math.floor(diff / 1000 / 60 / 60);
            return `${hours} hours ago`;
        }
        else if (now.getMonth() === msgDate.getMonth() && now.getFullYear() === msgDate.getFullYear()) {
            const diff = now.getTime() - msgDate.getTime();
            const days = Math.floor(diff / 1000 / 60 / 60 / 24);
            return `${days} days ago`;
        }
        else if (now.getFullYear() === msgDate.getFullYear()) {
            const diff = now.getTime() - msgDate.getTime();
            const months = Math.floor(diff / 1000 / 60 / 60 / 24 / 30);
            return `${months} months ago`;
        }
        else {
            const diff = now.getTime() - msgDate.getTime();
            const years = Math.floor(diff / 1000 / 60 / 60 / 24 / 30 / 12);
            return `${years} years ago`;
        }
    }

    return <>
        <div className="w-full px-20" onKeyPress={e => {
            if (e.key === 'Enter') {
                if (message.length > 140) return setError("Message is too long");
                if (message) {
                    var newm = message.slice(0, 60) + "\n" + message.slice(60, message.length)
                    connection.emit('message', { message: newm });
                    setMessage("");
                }
            }}}>

            <div className="px-5 py-5 overflow-y-auto h-[65%]">
                <div className="flex flex-col space-y-3 min-w-[90%]">
                    {messages.filter(Boolean).filter(el => {
                        if (!el.system) {
                            if (el.user) return true;
                            if (el.message && el.message.length > 0) return true;

                            return false;
                        } else return true;
                    }).map((message, index) => {
                        if (message.system) {
                            return <div key={index} className="flex justify-center items-center">
                                <p className="text-xs text-gray-700">{message.message}</p>
                            </div>
                        } else {
                            if (message.self) {
                                return <div key={index} className="flex justify-end items-center gap-2">
                                    <div className="flex flex-col items-end text-right">
                                        <p className="text-xs text-gray-700">{message.user.username}</p>
                                        <div className="bg-zinc-500/10 rounded-xl p-3">
                                            <p className="text-sm text-black">{message.message}</p>
                                        </div>
                                        <p className="text-xs text-gray-500">{dateNow(message.date)}</p>
                                    </div>
                                    <img src={`https://avatars.dicebear.com/api/micah/${message.user?.username || "No Name"}.png`} alt="username" className="w-10 h-10 rounded-full" />
                                </div>
                            } else {
                                return <div key={index} className="flex justify-start items-center gap-2">
                                    <img src={`https://avatars.dicebear.com/api/micah/${message.user?.username || "No Name"}.png`} alt="username" className="w-10 h-10 rounded-full" />
                                    <div className="flex flex-col items-start">
                                        <p className="text-xs text-gray-700">{message.user.username}</p>
                                        <div className="bg-zinc-500/10 rounded-xl p-3">
                                            <p className="text-sm text-black">{message.message}</p>
                                        </div>
                                        <p className="text-xs text-gray-500">{dateNow(message.date)}</p>
                                    </div>
                                </div>
                            }
                        }
                    })}
                </div>
            </div>
            <div className="border-t border-zinc-500/5 px-6 py-5 fixed bottom-0 space-y-2 min-w-[60%]">
                {error && <div className="w-full rounded-md px-4 p-2 border-red-500 border text-red-500 bg-red-500/20 mt-4">
                    <p>{error || "Something went wrong.."}</p>
                </div>}
                <div className="flex items-center">
                    <input name="message" type="text" value={message} onChange={(event) => {
                        if (event.target.value.length > 140) return setError("Message is too long");
                        setMessage(event.target.value)
                        setError("")
                    }} className="bg-zinc-500/10 rounded-md w-full px-4 py-2 text-black outline-none" autoComplete="off" placeholder="Type a message..." />
                    <button onClick={e => {
                        e.preventDefault();
                        if (message.length > 140) return setError("Message is too long");
                        if (message) {
                            var newm = message.slice(0, 60) + "\n" + message.slice(60, message.length)
                            connection.emit('message', { message: newm });
                            setMessage("");
                        }
                    }} type="button" className="bg-zinc-500/10 hover:bg-zinc-500/20 rounded-md p-2 ml-2 transition-all duration-200" disabled={error ? true : false}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <UserSidebar members={members} room={room?.name} LeaveRoom={LeaveRoom} />

    </>
}