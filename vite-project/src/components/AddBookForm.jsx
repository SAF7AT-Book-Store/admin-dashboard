/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { addBook, getAuthors, getCategories } from "../services/api";
import toast from "react-hot-toast";

const AddBookForm = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0); // New state
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [sourcePath, setSourcePath] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [samplePdf, setSamplePdf] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await getCategories();
        const fetchedAuthors = await getAuthors();
        setCategories(fetchedCategories);
        setAuthors(fetchedAuthors);
      } catch (error) {
        toast.error("Failed to load authors and categories");
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e, setFile) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (
      e.target.name === "samplePdf" &&
      selectedFile.type !== "application/pdf"
    ) {
      toast.error("Only PDF files are allowed for sample!");
      return;
    }

    if (selectedFile.size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !author ||
      !sourcePath ||
      !coverImage ||
      !samplePdf
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (price < 0) {
      toast.error("Price cannot be less than 0!");
      return;
    }

    const discountedPrice = price - price * (discountPercentage / 100);

    setUploading(true);

    try {
      await addBook(
        { title, description, price, category, author, discountPercentage },
        sourcePath,
        coverImage,
        samplePdf
      );
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setAuthor("");
      setDiscountPercentage(0);
      setSourcePath(null);
      setCoverImage(null);
      setSamplePdf(null);
      toast.success("Book added successfully!");
      onAdd();
    } catch (error) {
      toast.error("Failed to add book");
      console.error("Failed to add book", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 max-w-4xl w-full">
      <form onSubmit={handleSubmit} className="">
        <h2 className="text-3xl text-center font-bold mb-5">Add a New Book</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full focus:border-blue-900 focus:ring"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input input-bordered w-full focus:border-blue-900 focus:ring"
          />

          <input
            type="number"
            placeholder="Discount Percentage"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="input input-bordered w-full focus:border-blue-900 focus:ring"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select select-bordered w-full focus:border-blue-900 focus:ring"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>

          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="select select-bordered w-full focus:border-blue-900 focus:ring"
          >
            <option className="text-[#936767]" value="">
              Select Author
            </option>
            {authors.map((auth) => (
              <option
                className="text-[#936767]"
                key={auth._id}
                value={auth.name}
              >
                {auth.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            //input input-bordered w-full focus:border-blue-900 focus:ring
            className="textarea textarea-bordered w-full input focus:border-blue-900 focus:ring md:col-span-2 resize-none h-24"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="mb-4">
            <label htmlFor="sourcePath" className="block text-[#936767] mb-2">
              The Full Book
            </label>
            <input
              type="file"
              name="sourcePath"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, setSourcePath)}
              className="file-input w-full border-gray-300"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="samplePdf" className="block text-[#936767] mb-2">
              Sample
            </label>
            <input
              type="file"
              name="samplePdf"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, setSamplePdf)}
              className="file-input w-full border-gray-300"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="coverImage" className="block text-[#936767] mb-2">
              Cover
            </label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setCoverImage)}
              className="file-input w-full border-gray-300"
            />
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-3">
          <button
            type="button"
            className={`btn bg-slate-200 font-bold py-2 px-2 rounded-lg w-28`}
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="submit"
            className="btn bg-blue-800 hover:bg-blue-950 w-28 text-white font-bold py-2 px-2 rounded-lg"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;
