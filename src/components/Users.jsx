import { Fragment, useEffect, useState } from "react";

export default function UserSidebar({ members, room, leaveRoom }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <>
            <div className="flex h-screen antialiased text-gray-900">

                <div className={`first-letter:inset-y-0 z-10 flex w-80 h-screen duration-1000 ${isSidebarOpen ? 'translate-x-0 relative   bg-white' : 'translate-x-full fixed'}`} style={{ transition: 'transform 0.3s', right: "0" }}>

                    <div className="z-10 flex flex-col flex-1">
                        <div className="flex items-center justify-between flex-shrink-0 w-full p-4">
                            <a href="#" className='flex items-center flex-shrink-0 space-x-2 p-3'>
                                <img className="w-10 h-10 rounded-full" src={`https://avatars.dicebear.com/api/micah/${room}.png`} alt="username" />
                                <span className="ml-3 text-xl font-bold text-gray-800 dark:text-light">{room}</span>
                            </a>
                            <div className="flex items-center justify-end gap-2">
                            <button onClick={leaveRoom} className="p-1 rounded-lg justify-end focus:outline-none focus:ring">
                                <i className="fa-duotone fa-sign-out text-2xl"></i>
                            </button>
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
                        </div>
                        <nav className="flex flex-col flex-1 px-1 mt-4 space-y-2">

                            <div className="overflow-y-auto h-full p-3 space-y-2">
                                {members?.map(member => (
                                    <div className="flex items-center justify-between px-6 py-5 text-black bg-zinc-500/5 rounded-lg">
                                        <div className="flex items-center w-full">
                                            <img src={`https://avatars.dicebear.com/api/micah/${member?.username || "No Name"}.png`} alt="username" className="w-10 h-10 rounded-full" />
                                            <div className="ml-3 flex items-center justify-between gap-2 w-full">
                                                <p className="text-sm font-medium">{member?.username ? member.username : "null"}</p>
                                                {room?.owner?.username === member?.username && <>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <i className="fa fa-crown text-sm font-medium text-yellow-500" />
                                                    </div>
                                                </>}

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </nav>
                    </div>
                </div>
                <main className="flex flex-col items-center justify-center flex-1">
                    <button onClick={() => setIsSidebarOpen(true)} className="fixed p-2 text-black rounded-lg top-5 right-5">
                        <i className="fa-duotone fa-users text-3xl"></i>
                        <span className="sr-only">Open menu</span>
                    </button>
                    <h1 className="sr-only">Home</h1>

                </main>
            </div>
        </>
    );
}
