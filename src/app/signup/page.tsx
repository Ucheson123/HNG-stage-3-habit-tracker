import Link from 'next/link';
import SignupForm from '../../components/auth/SignupForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <SignupForm />
      
      <div className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </div>
    </main>
  );
}