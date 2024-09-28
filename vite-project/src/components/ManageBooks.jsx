import React, { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../services/api";
import AddBookForm from "./AddBookForm";
import EditBookForm from "./EditBookForm"; // Import the new component
import toast, { Toaster } from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      toast.error("Failed to fetch books");
      console.error("Failed to fetch books", error);
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBook(bookToDelete._id);
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookToDelete._id)
      );
      toast.success("Book deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete book");
      console.error("Failed to delete book", error);
    } finally {
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleUpdateSuccess = () => {
    fetchBooks(); // Refresh the book list after editing
    setEditingBook(null);
  };

  const handleAddBook = () => {
    setShowAddBookModal(true);
  };

  const handleAddBookSuccess = () => {
    fetchBooks(); // Refresh the book list after adding a new book
    setShowAddBookModal(false);
  };

  const handleCloseAddModal = () => {
    setShowAddBookModal(false); // Close the modal when the "Close" button is clicked
  };

  return (
    <div className="container mx-auto my-8 p-4 lg:p-8 flex flex-col items-center shadow-lg rounded-lg">
      <Toaster />
      <h2 className="text-3xl font-bold mb-6 ">Manage Books</h2>

      <div className="overflow-x-auto w-full">
        <table className="table-auto w-full text-center shadow-md rounded-lg mb-8 ">
          <thead>
            <tr className="bg-gray-200 text-sm">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Author</th>
              <th className="px-4 py-2 border">Cover Image</th>
              <th className="px-4 py-2 border">Sample PDF</th>
              <th className="px-4 py-2 border">Source Path</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book, index) => (
                <tr key={book._id} className="border-t hover:bg-gray-100">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border text-sm truncate">{book.title}</td>
                  <td className="px-4 py-2 border text-sm truncate max-w-xs">{book.description}</td>
                  <td className="px-4 py-2 border">${book.price}</td>
                  <td className="px-4 py-2 border">{book.category}</td>
                  <td className="px-4 py-2 border">{book.author}</td>
                  <td className="px-4 py-2 border">
                    <img
                      src={book.coverImage}
                      alt="cover"
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <a
                      href={book.samplePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-900 hover:underline"
                    >
                      View Sample
                    </a>
                  </td>
                  <td className="px-4 py-2 border">
                    <a
                      href={book.sourcePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-900 hover:underline"
                    >
                      View File
                    </a>
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="bg-cyan-900 hover:bg-cyan-800 text-white p-2 rounded-full flex items-center justify-center"
                        onClick={() => handleEdit(book)}
                        title="Edit Book"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full flex items-center justify-center"
                        onClick={() => handleDeleteClick(book)}
                        title="Delete Book"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  No books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box bg-white p-8 rounded shadow-lg max-w-lg w-full mx-4">
            <EditBookForm
              book={editingBook}
              onUpdateSuccess={handleUpdateSuccess}
              onCancel={() => setEditingBook(null)}
            />
          </div>
        </div>
      )}

      {showAddBookModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box bg-white p-8 rounded shadow-lg max-w-lg w-full mx-4">
            <AddBookForm
              onAdd={handleAddBookSuccess}
              onClose={handleCloseAddModal}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box bg-white p-8 rounded shadow-lg max-w-lg w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-red-600">
              Delete Confirmation
            </h3>
            <p>Are you sure you want to delete this book?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDeleteConfirm}
                className="btn btn-danger bg-red-600 hover:bg-red-700 text-white mr-2"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleAddBook}
        className="fixed bottom-4 right-4 bg-cyan-900 hover:bg-cyan-800 text-white rounded-md px-4 py-2 flex items-center"
        style={{ width: '200px', height: '50px' }}
      >
        <FaPlus className="mr-2" /> Add Book
      </button>
    </div>
  );
};

export default ManageBooks;
