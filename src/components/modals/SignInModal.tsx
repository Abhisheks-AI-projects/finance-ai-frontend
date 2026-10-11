"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeSignIn, openSignUp } from "@/store/slices/modalSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Modal from "./Modal";
import "./auth-form.css";

const SignInModal = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const isOpen = useAppSelector((state) => state.modal.isSignInOpen);

  useEffect(() => {
    if (isSignedIn && isOpen) {
      dispatch(closeSignIn());
      router.push("/chat");
    }
  }, [isSignedIn, isOpen, dispatch, router]);

  const handleSwitchToSignUp = () => {
    dispatch(closeSignIn());
    dispatch(openSignUp());
  };

  return (
    <Modal isOpen={isOpen} onClose={() => dispatch(closeSignIn())}>
      <div className="p-6 md:px-10 md:py-10">
        <SignIn
          routing="hash"
          forceRedirectUrl="/chat"
          signUpForceRedirectUrl="/chat"
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
          Don&apos;t have an account?{" "}
          <button
            onClick={handleSwitchToSignUp}
            className="text-foreground hover:underline font-medium cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default SignInModal;
