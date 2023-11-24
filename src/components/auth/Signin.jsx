import { Button } from "@components/ui/Button"
import { Input } from "@components/ui/Input"
import { Google } from "./Google"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@utils/firebase";
import { ROOT } from "@routes/routes";

export const Signin = ({ closeModal }) => {

    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setSuccess("Succesfully logged in! Redirecting...");
            setError("");
            if (closeModal) {
                closeModal();
            }
            navigate(ROOT)
        } catch (error) {
            if (error.code) {
                switch (error.code) {
                    case "auth/invalid-email":
                    case "auth/wrong-password":
                    case "auth/invalid-login-credentials":
                        setError("Invalid email or password.");
                        break;
                    case "auth/user-not-found":
                        setError("User not found.");
                        break;
                    default:
                        setError("Something went wrong. Please try again later.");
                        console.error("Could not complete signin:", error);
                        break;
                }
            } else {
                console.error("Could not signin user:", error)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        signIn();
    }

    return (
        <div className="flex flex-col gap-6">
            <Google closeModal={closeModal} />
            <div className="flex items-center gap-2">
                <span className="h-px w-1/2 bg-faint" />
                <span className="text-xs text-faint">OR</span>
                <span className="h-px w-1/2 bg-faint" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-2">
                {error && <span className="error">{error}</span>}
                {success && <span className="success">{success}</span>}
                <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email address"
                    placeholder="cool.redditor@mail.com"
                />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    placeholder="••••••••"
                />
                <div className="pt-4">
                    <Button type="primary" width="full">
                        Log In
                    </Button>
                </div>
            </form>

        </div>
    )
}