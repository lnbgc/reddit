import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { useAuth } from "@contexts/AuthContext"
import { ROOT } from "@routes/routes";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

export const SetUsername = () => {

    const { user, createUser, usernameCheck } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkUsername(username)) {
            return;
        }
        try {
            const isUsernameAvailable = await usernameCheck(username);
            if (!isUsernameAvailable) {
                setError("Username is already taken.");
                return;
            }
            await createUser(user.uid, username, user.email);
            setSuccess("Succesfully registered! Redirecting...");
            setError("");
            navigate(ROOT);
        } catch (error) {
            console.error("Could not complete signup:", error);
            setError("Something went wrong. Please try again later.")
        }
    }
    return (
        <>
        <Helmet>
            <title>Complete registration - Reddit</title>
        </Helmet>
            <div className="flex items-center justify-center headerless">
                <div className="flex flex-col w-full max-w-sm gap-6">
                    <h1 className="text-2xl font-bold">Seems you’re new here!</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {success && (
                            <span className="success">{success}</span>
                        )}
                        <Input
                            type="text"
                            error={error}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            description="Choose an username to complete registration."
                        />
                        <Button type="primary">Submit</Button>
                    </form>
                </div>
            </div>
        </>
    )
}