import SigninForm from "@/components/auth/signin-form";

const SignInPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 md:p-6 lg:p-8">
      <SigninForm />
    </div>
  );
};

export default SignInPage;
