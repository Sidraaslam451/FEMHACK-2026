import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
          Project Name
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-10">
          A short tagline describing what this app does — replace this on hackathon day.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-purple-700 transition-colors"
          >
            Login
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-white/90">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <h3 className="font-semibold text-lg mb-2">Feature One</h3>
            <p className="text-sm text-white/70">Short description of the first key feature.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <h3 className="font-semibold text-lg mb-2">Feature Two</h3>
            <p className="text-sm text-white/70">Short description of the second key feature.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <h3 className="font-semibold text-lg mb-2">Feature Three</h3>
            <p className="text-sm text-white/70">Short description of the third key feature.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;