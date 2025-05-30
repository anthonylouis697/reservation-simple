
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
