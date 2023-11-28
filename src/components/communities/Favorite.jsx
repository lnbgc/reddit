import { Button } from "@components/ui/Button";
import { useAuth } from "@contexts/AuthContext";
import { db } from "@utils/firebase";
import { arrayUnion, arrayRemove, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export const Favorite = ({ communityID }) => {
    const { userData } = useAuth();
    const [faved, setFaved] = useState(false);

    useEffect(() => {
        setFaved(userData?.favorite_communities.includes(communityID));
    }, [communityID, userData]);

    const toggleFavorites = async () => {
        try {
            if (faved) {
                await updateDoc(doc(db, "users", userData.uid), {
                    favorite_communities: arrayRemove(communityID),
                });
            } else {
                await updateDoc(doc(db, "users", userData.uid), {
                    favorite_communities: arrayUnion(communityID),
                });
            }
            setFaved(!faved);
        } catch (error) {
            console.error("Could not update favorites:", error);
        }
    };

    return (
        <Button type="secondary" onClick={toggleFavorites}>
            {faved ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
    );
};
