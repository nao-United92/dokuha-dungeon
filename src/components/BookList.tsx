import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface Book {
  id: string;
  title: string;
  total_pages: number;
  current_page: number;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user.id)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('本の取得エラー:', error);
    }
  };

  const handleUpdatePage = async (bookId: string, newPage: number) => {
    try {
      const { error } = await supabase
        .from('books')
        .update({ current_page: newPage })
        .eq('id', bookId);

      if (error) throw error;
      // UIを更新
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, current_page: newPage } : book
        )
      );
    } catch (error) {
      console.error('進捗更新エラー:', error);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4 text-amber-400">冒険中の書物</h2>
      <ul className="space-y-6">
        {books.map((book) => (
          <li
            key={book.id}
            className="p-4 bg-slate-900 rounded-lg border border-slate-700 shadow-sm"
          >
            <h3 className="text-xl font-semibold text-gray-100">{book.title}</h3>
            <p className="text-gray-300 mt-1">総ページ数: {book.total_pages}</p>
            <div className="mt-3 flex items-center space-x-3">
              <input
                type="number"
                value={book.current_page}
                onChange={(e) =>
                  handleUpdatePage(book.id, parseInt(e.target.value))
                }
                className="input-field w-24 p-2 bg-slate-800"
              />
              <span className="text-gray-300">/ {book.total_pages} ページ</span>
            </div>
            <div className="mt-3 h-4 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{
                  width: `${(book.current_page / book.total_pages) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-right text-sm text-cyan-400 mt-1">
              {Math.floor((book.current_page / book.total_pages) * 100)}% 読破
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
