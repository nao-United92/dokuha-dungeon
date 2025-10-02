import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import RegisterBook from './components/RegisterBook';
import BookList from './components/BookList';

function App() {
  const [session, setSession] = useState<
    import('@supabase/supabase-js').Session | null
  >(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="min-h-screen bg-stone-900 text-gray-200 p-6 font-serif">
      <div className="max-w-4xl mx-auto w-full py-16 sm:py-24">
        <header className="flex justify-between items-center mb-8 border-b-2 border-stone-700 pb-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
            読破ダンジョン
          </h1>
          {session ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              ログアウト
            </button>
          ) : (
            <button
              onClick={() =>
                supabase.auth.signInWithOAuth({ provider: 'google' })
              }
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              入国する
            </button>
          )}
        </header>
        <main>
          {session ? (
            <div className="space-y-8">
              <RegisterBook />
              <BookList />
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-300 mb-4">
                冒険を始めるにはログインが必要です
              </h2>
              <p className="text-gray-400">
                ダンジョンに入国し、あなたの読破の旅を記録しよう。
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
