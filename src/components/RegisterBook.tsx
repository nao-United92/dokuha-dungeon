import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const RegisterBook = () => {
  const [title, setTitle] = useState('');
  const [totalPages, setTotalPages] = useState(0);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      alert('ログインが必要です。');
      return;
    }

    try {
      const { error } = await supabase.from('books').insert([
        {
          user_id: user.id,
          title,
          total_pages: totalPages,
          current_page: 0,
        },
      ]);

      if (error) throw error;
      alert('本を登録しました！');
      setTitle('');
      setTotalPages(0);
    } catch (error) {
      console.error('登録エラー:', error);
      alert('登録に失敗しました。');
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-white">新しい本を登録する</h2>
      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="本のタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="number"
          placeholder="総ページ数"
          value={totalPages}
          onChange={(e) => setTotalPages(parseInt(e.target.value))}
          className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-300"
        >
          登録
        </button>
      </form>
    </div>
  );
};

export default RegisterBook;
