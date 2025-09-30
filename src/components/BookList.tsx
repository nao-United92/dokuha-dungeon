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
    <div className="p-6 bg-gray-900 rounded-lg shadow-xl text-white">
      <h2 className="text-xl font-bold mb-4">私の積読リスト</h2>
      <ul className="space-y-4">
        {books.map((book) => (
          <li key={book.id} className="p-4 bg-gray-800 rounded-md">
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-gray-400">総ページ数: {book.total_pages}</p>
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="number"
                value={book.current_page}
                onChange={(e) =>
                  handleUpdatePage(book.id, parseInt(e.target.value))
                }
                className="w-20 p-2 rounded-md bg-gray-700 text-white"
              />
              <span className="text-gray-300">/ {book.total_pages} ページ</span>
            </div>
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${(book.current_page / book.total_pages) * 100}%`,
                }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
