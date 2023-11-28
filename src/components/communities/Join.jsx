import { Button } from "@components/ui/Button"
import { useAuth } from "@contexts/AuthContext"
import { db } from "@utils/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export const Join = ({ communityID }) => {

    const { userData } = useAuth();
    const [joined, setJoined] = useState(false);

    useEffect(() => {
        setJoined(userData?.following_communities.includes(communityID));
    }, [communityID, userData]);

    const toggleJoin = async () => {
        try {
            if (joined) {
                await updateDoc(doc(db, "users", userData.uid), {
                    following_communities: arrayRemove(communityID),
                });
                await updateDoc(doc(db, "communities", communityID), {
                    followers: arrayRemove(userData.uid),
                });
            } else {
                await updateDoc(doc(db, "users", userData.uid), {
                    following_communities: arrayUnion(communityID),
                });
                await updateDoc(doc(db, "communities", communityID), {
                    followers: arrayUnion(userData.uid),
                });
            }
            setJoined(!joined);
        } catch (error) {
            console.error("Error toggling community join:", error);
        }
    };

    return (
        <Button type={joined ? "secondary" : "primary"} onClick={toggleJoin}>
            {joined ? "Joined" : "Join"}
        </Button>
    )
}
