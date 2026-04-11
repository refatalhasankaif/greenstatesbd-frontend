import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md bg-background border rounded-xl p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;