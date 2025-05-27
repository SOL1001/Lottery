import React, { useState } from "react";
import axios from "axios";

interface FormData {
  name: string;
  value: string;
  ticketsLeft: number;
  ticketPrice: number;
  endDate: string;
  category: string;
  featured: boolean;
  image: File | null;
}

const CreatePostPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    value: "",
    ticketsLeft: 0,
    ticketPrice: 0,
    endDate: "",
    category: "",
    featured: false,
    image: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("value", formData.value);
    data.append("ticketsLeft", formData.ticketsLeft.toString());
    data.append("ticketPrice", formData.ticketPrice.toString());
    data.append("endDate", formData.endDate);
    data.append("category", formData.category);
    data.append("featured", formData.featured.toString());
    if (formData.image) {
      data.append("image", formData.image);
    }
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://192.168.42.246:5000/api/posts",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message || "Post created successfully!");
      setFormData({
        name: "",
        value: "",
        ticketsLeft: 0,
        ticketPrice: 0,
        endDate: "",
        category: "",
        featured: false,
        image: null,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create New Lottery
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create a new lottery prize
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="mt-8 space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Prize Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="e.g. Luxury Apartment"
              />
            </div>

            <div>
              <label
                htmlFor="value"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Estimated Value <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="e.g. 250,000"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="ticketsLeft"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tickets Available <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="ticketsLeft"
                name="ticketsLeft"
                value={formData.ticketsLeft}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="Total tickets"
              />
            </div>

            <div>
              <label
                htmlFor="ticketPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ticket Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  id="ticketPrice"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="Price per ticket"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Draw Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="e.g. Real Estate, Automotive, etc."
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Prize Image <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                  {formData.image && (
                    <p className="text-sm text-indigo-600 mt-2">
                      {formData.image.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="featured"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Feature this lottery on homepage
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Lottery"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
