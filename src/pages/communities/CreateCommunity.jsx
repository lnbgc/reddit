import { useState } from "react";
import { Button } from "@components/ui/Button";
import { useAuth } from "@contexts/AuthContext";
import { db } from "@utils/firebase";
import { addDoc, arrayUnion, collection, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "@assets/community-default.svg"

export const CreateCommunity = () => {

    const { userData } = useAuth();
    const navigate = useNavigate();

    const [url, setUrl] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isCommunityURLAvailable = async (url) => {
        try {
            const querySnapshot = await getDocs(collection(db, "communities"));
            const URLS = querySnapshot.docs.map((doc) => doc.data().url);
            return !URLS.includes(url);
        } catch (error) {
            console.error("Could not check URL availability:", error)
        }
    }

    const checkURL = (url) => {
        if (url === "") {
            setError("URL cannot be empty.");
            return false;
        }
        if (url.length < 5 || url.length > 21) {
            setError("URL must be between 3 and 21 characters.");
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(url)) {
            setError("Can only contain letters, numbers, and underscores.");
            return false;
        }
        return true;
    }

    const addCommunity = async (url) => {
        try {
            const isURLAvailable = await isCommunityURLAvailable(url);
            if (!isURLAvailable) {
                setError("URL already exists. Please choose a different URL.");
                return;
            }
            const communities = collection(db, "communities");
            const communityDoc = await addDoc(communities, {
                name: url,
                url,
                avatar: defaultAvatar,
                description: "",
                createdAt: serverTimestamp(),
                moderators: [userData.uid],
                followers: [userData.uid],
                flairs: [],
                rules: [],
                posts: [],
            });
            const communityID = communityDoc.id;
            await updateDoc(communityDoc, { id: communityID });

            const userDoc = doc(db, "users", userData.uid);
            await updateDoc(userDoc, {
                following_communities: arrayUnion(communityID)
            });
            setSuccess("Community created successfully! Redirecting...");
            setError("");
            navigate(`/r/${url}`);
        } catch (error) {
            console.error("Could not create community:", error);
            setError("Something went wrong. Please try again later.");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (checkURL(url)) {
            addCommunity(url);
        }
    }

    return (
        <div className="headerless flex flex-col justify-center items-center">
            <div className="max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h1 className="font-bold text-xl">Create your community</h1>
                    <div className="flex flex-col gap-1">
                        <h2 className="font-semibold">Name</h2>
                        <p className="text-sm text-muted">
                            Community names are case sensitive and cannot be changed.
                        </p>
                        {error && <span className="error mt-3">{error}</span>}
                        {success && <span className="success mt-3">{success}</span>}
                    </div>

                    <div className="border border-border rounded-md shadow-sm px-3 py-2 max-w-[26.5rem]">
                        <span className="text-faint font-medium select-none mr-0.5">r/</span>
                        <input
                            type="text"
                            className="outline-none bg-transparent w-11/12"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                    <p className="text-sm text-muted">
                        Community names cannot have spaces (e.g., "r/bookclub" not "r/book club"), must be
                        between 3-21 characters, and underscores ("_") are the only special
                        characters allowed.
                    </p>
                </form>
                <div className="flex items-center gap-2 mt-4">
                    <Button type="secondary" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button type="primary" onClick={handleSubmit}>Create Community</Button>
                </div>
            </div>
        </div>
    )
}