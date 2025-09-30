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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500">
          読破ダンジョン
        </h1>
        {session ? (
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded-md font-bold"
          >
            ログアウト
          </button>
        ) : (
          <button
            onClick={() =>
              supabase.auth.signInWithOAuth({ provider: 'google' })
            }
            className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md font-bold"
          >
            Googleでログイン
          </button>
        )}
      </header>
      {session ? (
        <div className="space-y-8">
          <RegisterBook />
          <BookList />
        </div>
      ) : (
        <p className="text-center text-gray-400">
          ログインして積読を始めよう！
        </p>
      )}
    </div>
  );
}

export default App;
