import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
        <p className="text-sm text-muted-foreground">
          Join PizzaHub as a customer or restaurant vendor
        </p>
      </div>
      <SignupForm />
    </div>
  );
}