"use client";

import { SignUp, useAuth } from "@clerk/nextjs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeSignUp, openSignIn } from "@/store/slices/modalSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Modal from "./Modal";
import "./auth-form.css";

const SignUpModal = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const isOpen = useAppSelector((state) => state.modal.isSignUpOpen);

  useEffect(() => {
    if (isSignedIn && isOpen) {
      dispatch(closeSignUp());
      router.push("/dashboard");
    }
  }, [isSignedIn, isOpen, dispatch, router]);

  const handleSwitchToSignIn = () => {
    dispatch(closeSignUp());
    dispatch(openSignIn());
  };

  return (
    <Modal isOpen={isOpen} onClose={() => dispatch(closeSignUp())}>
      <div className="p-6 md:px-10 md:py-10">
        <SignUp
          routing="hash"
          forceRedirectUrl="/dashboard"
          signInForceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: { width: "100%" },
              cardBox: { width: "100%", maxWidth: "100%", boxShadow: "none", border: "none" },
              card: { width: "100%", maxWidth: "100%", padding: "0", boxShadow: "none" },
              formFieldInput: { width: "100%", boxSizing: "border-box" },
              formButtonPrimary: { width: "100%" },
              socialButtonsBlockButton: { width: "100%" },
            },
          }}
        />
        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{" "}
          <button
            onClick={handleSwitchToSignIn}
            className="text-foreground hover:underline font-medium cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default SignUpModal;
