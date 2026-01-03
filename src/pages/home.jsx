import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <header className="flex justify-start items-center py-4 px-4 md:px- shadow-sm">
        <div className="flex items-center gap-2">
          <img
            src="/src/assets/logo-green.png"
            alt="logo"
            className="h-12 w-auto"
          />
          <h1 className="text-2xl font-extrabold text-green-700">LeoGPT</h1>
        </div>

      </header>

      <main>
        {/* Hero Section */}
        <section className="px-6 md:px-12 py-16 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Your Smart AI Companion —
            <span className="text-green-600"> LeoGPT</span>
          </h2>

          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Chat, learn, create, and explore ideas with an intelligent assistant
            designed to be fast, helpful, and intuitive.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-green-600 text-white text-lg font-medium shadow hover:bg-green-700 transition"
            >
              Try Leo
            </Link>
 
            <Link
              to="/signup"
              className="px-6 py-3 rounded-xl border border-green-600 text-green-700 text-lg font-medium hover:bg-green-50 transition"
            >
              Create Account
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 md:px-12 pb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose LeoGPT?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-green-700">Fast & Smart</h4>
              <p className="mt-2 text-gray-600">
                Get instant, accurate responses powered by intelligent reasoning.
              </p>
            </div>

            <div className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-green-700">Clean Interface</h4>
              <p className="mt-2 text-gray-600">
                A minimal and distraction-free experience for smooth conversations.
              </p>
            </div>

            <div className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-green-700">Always Improving</h4>
              <p className="mt-2 text-gray-600">
                Constantly evolving to help you learn, build, and explore more.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-6 text-gray-600 border-t">
        © {new Date().getFullYear()} LeoGPT — All rights reserved
      </footer>
    </>
  );
};

export default Home;
