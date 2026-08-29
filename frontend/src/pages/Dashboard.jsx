import { useAuth } from '../context/useAuth.js';
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      <p className="text-gray-600">Dashboard placeholder — replace with real content on hackathon day.</p>
    </div>
  );
};

export default Dashboard;