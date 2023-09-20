import { Dialog, Transition } from "@headlessui/react";
import { useConnection } from "context/connect";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import CreateRoom from "./Modal";

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    let [rooms, setRooms] = useState([]);
    let [user, setUser] = useState(null);
    let [isOpen, setIsOpen] = useState(false);
    let [protectedRoom, setProtected] = useState(false);
    let [password, setPassword] = useState('');
    const { connection } = useConnection();

    useEffect(() => {
        if (connection) {
            connection.emit('fetchUser');
            connection.on('user', data => {
                if (data === null) {
                    router.push('/');
                } else {
                    setUser(data);
                }
            });

            return () => {
                connection.off('user', data => {
                    if (data === null) {
                        router.push('/');
                    } else {
                        setUser(data);
                    }
                });
            }
        }
    }, [connection]);

    useEffect(() => {
        if (connection) {
            connection.emit('fetchRooms');
            connection.on('rooms', data => {
                setRooms(data.rooms);
            });

            return () => {
                connection.off('rooms', data => {
                    if (data.isLogged) {
                        setUser(data.user);
                    }
                    setRooms(data.rooms);
                });
            }
        }
    }, []);

    const JoinRoom = room => {
        const { id, passwordProtected } = room;
        console.log(room);
        if (passwordProtected) {
            setIsOpen(true);
            setProtected(room);

            if (password) {
                connection.emit('joinRoom', { id, password });
            }

        } else {
            connection.emit('joinRoom', { id });
        }
        console.log('joinRoom');
        connection.off('joinRoom').on('joinRoom', data => {
            console.log(data);
            if (data.success) {
                setIsOpen(false);
                setPassword('');
                router.push('/rooms/' + id);
            } else {
                if (data?.alreadyIn) {
                    router.push('/rooms/' + id);
                } else {
                    alert(data.error)
                }
            }
        });
    }

    return (
        <>
            <CreateRoom isOpen={isModalOpen} setIsOpen={setIsModalOpen} connection={connection} router={router} />
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => {
                    setIsOpen(false);
                    setPassword('');
                }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-1 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-white"
                                    >
                                        Password Protected Room
                                    </Dialog.Title>
                                    <form>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-300">
                                                This room is password protected. Please enter the password to join.
                                            </p>

                                            <input
                                                type="password"
                                                className="w-full mt-2 p-2 rounded-md bg-dark-2 text-white outline-none border border-white/5 focus:border-blue-500 transition-all duration-200"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                onClick={() => JoinRoom(protectedRoom)}
                                                className="transition-all duration-200 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                            >
                                                Join
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className="flex h-screen antialiased text-gray-900 bg-gray-100 dark:bg-dark dark:text-light">

                <div className={`first-letter:inset-y-0 z-10 bg-white flex w-80 h-screen translate-x-0 ${isSidebarOpen ? 'translate-x-0 relative' : '-translate-x-full fixed'}`} style={{ transition: 'transform 0.3s', transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>

                    <div className="z-10 flex flex-col flex-1">
                        <div className="flex items-center justify-between flex-shrink-0 w-full p-4">
                            <a href="#" className='flex items-center flex-shrink-0 space-x-2'>
                                <img src='https://avatars.githubusercontent.com/u/73245847?v=4' className="w-14 rounded-full border-2 border-gray-300" alt="avatar" />
                                <span className="ml-3 text-xl font-bold text-gray-800 dark:text-light">Chat App</span>
                            </a>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-lg justify-end focus:outline-none focus:ring">
                                <svg
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="flex flex-col flex-1 px-1 mt-4 space-y-2">

                            {rooms.map(room => {
                                return (
                                    <div
                                        key={room.id}
                                        className="flex items-center justify-between flex-shrink-0 w-full p-4 cursor-pointer"
                                        onClick={() => JoinRoom(room)}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <img
                                                src={`https://avatars.dicebear.com/api/initials/${room?.name || "No Name"}.png`}
                                                alt="username"
                                                className="w-10 h-10 rounded-md"
                                            />
                                            <div className="px-3 flex-col flex min-w-32">
                                                <span className="font-semibold">{room.name}</span>
                                                <span className="text-xs text-gray-400">
                                                    Created by {room?.owner?.username.split(0, 5) + '...'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-between items-center space-x-1">
                                            <span className="text-xs text-gray-400">
                                                {room.users || 0}/{room.maxUsers}
                                            </span>
                                            {room.passwordProtected && (
                                                <i className="fas fa-lock text-gray-400"></i>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </nav>

                        <div className="flex-shrink-0 p-4">
                            <button onClick={() => setIsModalOpen(true)} className="w-full rounded-md px-4 py-2  bg-indigo-300 hover:bg-indigo-400 justify-center transition-all duration-1000 mx-auto">Create Room</button>
                            <div className="flex items-center space-y-3 mt-6 w-full">
                                <div className="flex flex-row items-center space-x-2 w-full px-2 py-1 rounded-lg transition-all duration-200">
                                    <img src={`https://avatars.dicebear.com/api/micah/${user?.username || "iamnullman"}.png`} alt="username" className="h-10 w-10 rounded-full" />
                                    <span className="font-semibold">{user?.username}</span>
                                </div>
                                <i className="fas fa-sign-out-alt text-gray-800 cursor-pointer" onClick={() => {
                                    connection.emit('logout');
                                    router.push('/');
                                }}></i>
                            </div>
                        </div>
                    </div>
                </div>
                <main className="flex flex-col items-center justify-center flex-1">
                    <button onClick={() => setIsSidebarOpen(true)} className="fixed p-2 text-black rounded-lg top-5 left-5">
                        <i className="fa-duotone fa-messages text-3xl"></i>
                        <span className="sr-only">Open menu</span>
                    </button>
                    <h1 className="sr-only">Home</h1>

                </main>
            </div>
        </>
    );
}
