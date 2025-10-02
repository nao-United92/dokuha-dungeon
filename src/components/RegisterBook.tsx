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
    <div className="card">
      <h2 className="text-2xl font-bold mb-4 text-amber-400">新しい本を追加する</h2>
      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="本のタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field w-full"
        />
        <input
          type="number"
          placeholder="総ページ数"
          value={totalPages}
          onChange={(e) => setTotalPages(parseInt(e.target.value))}
          className="input-field w-full"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          追加する
        </button>
      </form>
    </div>
  );
};

export default RegisterBook;
