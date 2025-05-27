import {
  FiHome,
  FiTrendingUp,
  FiClock,
  FiDollarSign,
  FiBell,
  FiSearch,
  FiPlus,
  FiFileText,
  FiMail,
  FiCalendar,
} from "react-icons/fi";
import Header from "../components/Header";

const RealEstateDashboard = () => {
  // Sample data
  const stats = [
    {
      title: "Total Properties",
      value: "1,248",
      icon: <FiHome className="text-2xl" />,
      change: "+12%",
    },
    {
      title: "Active Listings",
      value: "342",
      icon: <FiTrendingUp className="text-2xl" />,
      change: "+5%",
    },
    {
      title: "Pending Deals",
      value: "28",
      icon: <FiClock className="text-2xl" />,
      change: "-2%",
    },
    {
      title: "Revenue This Month",
      value: "$84,500",
      icon: <FiDollarSign className="text-2xl" />,
      change: "+18%",
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      property: "Luxury Villa",
      client: "John Smith",
      date: "2023-06-15",
      status: "Completed",
    },
    {
      id: 2,
      property: "Downtown Apartment",
      client: "Sarah Johnson",
      date: "2023-06-14",
      status: "Pending",
    },
    {
      id: 3,
      property: "Suburban House",
      client: "Michael Brown",
      date: "2023-06-12",
      status: "Completed",
    },
    {
      id: 4,
      property: "Beachfront Property",
      client: "Emily Davis",
      date: "2023-06-10",
      status: "Cancelled",
    },
  ];

  const newLeads = [
    {
      id: 1,
      name: "Robert Wilson",
      email: "robert@example.com",
      phone: "(555) 123-4567",
      interest: "Commercial",
    },
    {
      id: 2,
      name: "Jennifer Lee",
      email: "jennifer@example.com",
      phone: "(555) 987-6543",
      interest: "Residential",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}

      <div className="flex-1 overflow-auto ">
        {/* Header */}
        <div className="sticky top-0 z-10">
          <Header title={"Dashboard"} />
        </div>
        {/* <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A16A] focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiBell className="text-2xl text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-[#00A16A] rounded-full flex items-center justify-center text-white">
                AD
              </div>
              <span className="text-gray-700">Admin</span>
            </div>
          </div>
        </header> */}

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#00A16A]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <p
                      className={`text-sm mt-2 ${
                        stat.change.startsWith("+")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-[#00A16A]/10 text-[#00A16A]">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Line Chart Placeholder */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Monthly Property Sales
              </h3>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                Line Chart Visualization
              </div>
            </div>

            {/* Pie Chart Placeholder */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Property Type Distribution
              </h3>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                Pie Chart Visualization
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <button className="text-sm text-[#00A16A] hover:underline">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.property}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {transaction.client}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              transaction.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : transaction.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* New Leads & Quick Actions */}
            <div className="space-y-6">
              {/* New Leads */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">New Leads</h3>
                  <button className="text-sm text-[#00A16A] hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {newLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h4 className="font-medium">{lead.name}</h4>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                      <p className="text-sm text-gray-500">{lead.phone}</p>
                      <div className="mt-2">
                        <span className="inline-block bg-[#00A16A]/10 text-[#00A16A] text-xs px-2 py-1 rounded">
                          {lead.interest}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex flex-col items-center justify-center p-4 bg-[#00A16A]/10 text-[#00A16A] rounded-lg hover:bg-[#00A16A]/20 transition">
                    <FiPlus className="text-xl mb-2" />
                    <span className="text-sm">Add Property</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-[#00A16A]/10 text-[#00A16A] rounded-lg hover:bg-[#00A16A]/20 transition">
                    <FiFileText className="text-xl mb-2" />
                    <span className="text-sm">Generate Report</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-[#00A16A]/10 text-[#00A16A] rounded-lg hover:bg-[#00A16A]/20 transition">
                    <FiMail className="text-xl mb-2" />
                    <span className="text-sm">Bulk Email</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-[#00A16A]/10 text-[#00A16A] rounded-lg hover:bg-[#00A16A]/20 transition">
                    <FiCalendar className="text-xl mb-2" />
                    <span className="text-sm">Open House</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RealEstateDashboard;
