import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react';

export default function CreateRoom({ isOpen, setIsOpen, connection, router }) {
    let [error, setError] = useState(null);

    const CreateRoom = event => {
        event.preventDefault();
        const name = event.target.name.value;
        const password = event.target.password.value;
        connection.emit('createRoom', { name, password });
        connection.on('createRoom', data => {
            const result = data;
            if (result.success) {
                router.push('/rooms/' + result.data.id);
            } else {
                setError(data.message);
            }
        });
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {
                setIsOpen(false);
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
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="bg-gray-300 md:shadow-lg shadow-none rounded-2xl p-10">
                                <Dialog.Title className="text-center text-indigo-600 text-3xl font-bold">Create new room</Dialog.Title>
                                <Dialog.Description className="text-sm text-gray-600">
                                    Create a new room to chat with your friends.
                                </Dialog.Description>

                                {error && <div className="w-full rounded-md px-4 p-2 border-red-500 border text-red-500 bg-red-500/20 mt-4">
                                    <p>{error || "Something went wrong.."}</p>
                                </div>}
                                <form onSubmit={CreateRoom} className="my-8 w-96 h-auto">
                                    <div className="relative mb-2">
                                        <label htmlFor="name" className="text-[12.5px] leading-tighter text-gray-900 uppercase font-medium text-base cursor-text">Room Name</label>
                                        <input id="name" autoComplete='off' className="text-black bg-gray-400/50 transition-all duration-200 w-full rounded-lg p-3 border border-gray-300/10 focus:border-blue-700 outline-none ring-none" type="text" />
                                    </div>
                                    <div className="relative mb-2">
                                        <label htmlFor="name" className="text-[12.5px] leading-tighter text-gray-000 uppercase font-medium text-base cursor-text">Password <span className="text-xs italic lowercase font-thin opacity-50">optional</span></label>
                                        <input id="password" autoComplete='off' className="text-black bg-gray-400/50 transition-all duration-200 w-full rounded-lg p-3 border border-gray-300/10 focus:border-blue-700 outline-none ring-none" type="text" />
                                    </div>
                                    <div className="space-y-9">
                                        <div className="text-sm flex justify-end items-center h-full mt-16">
                                            <button className="py-2.5 px-12 rounded text-black btn bg-gradient-to-r from-indigo-600 to-indigo-800 hover:opacity-80 transition-all duration-200">Create</button>
                                            <button onClick={() => setIsOpen(false)} className='px-8'>Cancel</button>
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}