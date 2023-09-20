import { useConnection } from 'context/connect'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const { connection } = useConnection();
  const router = useRouter();
  let [error, setError] = useState(null);

  const Login = event => {
    event.preventDefault();
    const username = event.target.username.value;
    connection.emit('login', { username });
    connection.on('login', data => {
      if (data.success) {
        router.push('/rooms');
      } else {
        setError(data.error);
      }
    });
  }

  useEffect(() => {
    if (connection) {
      connection.emit('fetchUser');
      connection.on('user', data => {
        if (data !== null) {
          router.push('/rooms');
        }
      });
    }
  }, []);

  return <>
    <div>
      <div className="md:h-screen relative flex flex-col justify-center items-center">
        <div className="bg-gray-300/20 md:shadow-lg shadow-none rounded-2xl p-10">
          <div className="flex flex-col items-center space-y-3">
            <span className="text-2xl font-semi-bold leading-normal text-black">Login</span>
          </div>
          {error && <div className="w-full rounded-md px-4 p-2 border-red-500 border text-red-500 bg-red-500/20 mt-4">
            <p>{error || "Something went wrong.."}</p>
          </div>}
          <form onSubmit={Login} className="my-8 w-96 h-32">
            <div className="relative mb-2">
              <label htmlFor="username" className="text-[12.5px] leading-tighter text-gray-900 uppercase font-medium text-base cursor-text">Username</label>
              <input id="username" autoComplete='off' className="text-black bg-gray-400/50 transition-all duration-200 w-full rounded-lg p-3 border border-gray-300/10 focus:border-blue-700 outline-none ring-none" type="text" />
            </div>
            <div className="space-y-9">
              <div className="text-sm flex justify-end items-center h-full mt-16">
                <button className="py-2.5 px-12 rounded text-black btn bg-gradient-to-r from-indigo-600 to-indigo-800 hover:opacity-80 transition-all duration-200">Next</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>
}
