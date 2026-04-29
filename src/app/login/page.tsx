import Link from 'next/link';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* We import and render the form we built in the previous step */}
      <LoginForm />
      
      {/* Adding a standard navigation link using Next.js <Link> for good UX */}
      <div className="mt-4 text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </div>
    </main>
  );
}