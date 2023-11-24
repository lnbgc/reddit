import { Button } from "@components/ui/Button"
import { Input } from "@components/ui/Input"
import { Google } from "./Google"
import { useAuth } from "@contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@utils/firebase";
import { ROOT } from "@routes/routes";

export const Signup = ({ closeModal }) => {

    const { usernameCheck, createUser } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const checkPassword = (password, confirm) => {
        if (password !== confirm) {
            setError("Passwords do not match.");
            return false;
        }
        return true;
    }

    const checkUsername = (username) => {
        if (username === "") {
            setError("Username cannot be empty.");
            return false;
        }
        if (username.length < 5 || username.length > 20) {
            setError("Username must be between 5 and 20 characters.");
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError("Only letters, numbers, and underscores allowed.");
            return false;
        }
        return true;
    }

    const signUp = async (username, email, password) => {
        try {
            const isUsernameAvailable = await usernameCheck(username);
            if (!isUsernameAvailable) {
                setError("Username is already taken.");
                return;
            }
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, { displayName: username });
            await createUser(user.uid, username, email);
            setSuccess("Successfully registered! Redirecting...");
            setError("");
            navigate(ROOT);
        } catch (error) {
            if (error.code) {
                switch (error.code) {
                    case "auth/invalid-email":
                        setError("Invalid email address.")
                        break;
                    case "auth/weak-password":
                        setError("Password must have at least 6 characters..")
                        break;
                    case "auth/email-already-in-use":
                        setError("Account already registered with this email address.")
                        break;
                    default:
                        setError("Something went wrong. Please try again later.")
                        console.error("Could not complete signup:", error);
                        break;
                }
            } else {
                console.error("Could not signup user:", error)
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (checkPassword(password, confirm) && checkUsername(username)) {
            signUp(username, email, password);
        }
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    label="Username"
                    placeholder="CoolRedditor"
                />
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
                <Input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    label="Confirm password"
                    placeholder="••••••••"
                />
                <div className="pt-4">
                    <Button type="primary" width="full">
                        Register
                    </Button>
                </div>
            </form>
        </div>
    )
}