import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt, FaRegClock, FaFire, FaCrown } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";

interface Post {
  _id: string;
  name: string;
  value: string;
  ticketsLeft: number;
  ticketPrice: number;
  image: string | null;
  endDate: string;
  category: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateProgress = (ticketsLeft: number, value: string) => {
    const totalTickets = Math.floor(parseInt(value.replace(/,/g, "")) / 2); // Simplified calculation
    return ((totalTickets - ticketsLeft) / totalTickets) * 100;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-900 to-indigo-800">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
          <p className="text-white font-medium">Loading Lottery Draws...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-900 to-indigo-800">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 5h2v6H9V5zm0 8h2v2H9v-2z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error loading draws</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 sm:text-5xl">
            Current Lottery Draws
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Your chance to win amazing prizes
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post._id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                post.featured ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              {post.featured && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-purple-900 px-2 py-1 rounded-md text-xs font-bold flex items-center">
                  <FaCrown className="mr-1" /> FEATURED
                </div>
              )}

              {post.image ? (
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={
                      post.image.startsWith("http")
                        ? post.image
                        : `http://localhost:5000${post.image}`
                    }
                    alt={post.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">
                      {post.name}
                    </h3>
                    <p className="text-sm text-white/80">{post.category}</p>
                  </div>
                </div>
              ) : (
                <div className="h-56 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                  <span className="text-xl font-medium">
                    No Image Available
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-yellow-600">
                    <GiMoneyStack className="mr-2" />
                    <span className="font-bold">${post.value}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <FaRegClock className="mr-2" />
                    <span className="text-sm">{formatDate(post.endDate)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Tickets sold</span>
                    <span>
                      {Math.floor(
                        parseInt(post.value.replace(/,/g, "")) / 2 -
                          post.ticketsLeft
                      )}{" "}
                      / {Math.floor(parseInt(post.value.replace(/,/g, "")) / 2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full"
                      style={{
                        width: `${calculateProgress(
                          post.ticketsLeft,
                          post.value
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <div className="text-purple-600 flex justify-center mb-1">
                      <FaTicketAlt />
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {post.ticketsLeft.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Tickets Left</div>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg text-center">
                    <div className="text-indigo-600 flex justify-center mb-1">
                      <FaFire />
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      ${post.ticketPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Per Ticket</div>
                  </div>
                </div>

                <button className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg text-center transition duration-200 shadow-md hover:shadow-lg">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
