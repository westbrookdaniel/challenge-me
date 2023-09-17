export function Login() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Login</h1>
      <LoginForm />
    </main>
  );
}

function LoginForm() {
  return (
    <form className="max-w-sm mt-4">
      <label className="block">
        <span>Email</span>
        <input
          type="email"
          id="email"
          name="email"
          className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-400 focus:ring focus:ring-stone-200 focus:ring-opacity-50"
          placeholder=""
        />
        <span id="email-error" className="text-red-500 text-sm" />
      </label>
      <label className="block mt-2">
        <span>Password</span>
        <input
          type="password"
          id="password"
          name="password"
          className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-400 focus:ring focus:ring-stone-200 focus:ring-opacity-50"
          placeholder=""
        />
        <span id="password-error" className="text-red-500 text-sm" />
      </label>
      <div className="flex space-x-2 mt-6">
        <a className="button" href="/">
          Cancel
        </a>
        <button type="submit">Login</button>
      </div>
      <span id="error" className="text-red-500 text-sm" />
    </form>
  );
}
