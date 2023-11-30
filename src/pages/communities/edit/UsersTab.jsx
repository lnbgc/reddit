import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@utils/firebase";
import { Search } from "lucide-react";
import { Modal, ModalBody, ModalHeader } from "@components/ui/Modal";
import { Button } from "@components/ui/Button";
import { useAuth } from "@contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const UsersTab = ({ communityData }) => {

    const { userData } = useAuth();
    const [moderators, setModerators] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFollower, setSelectedFollower] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setModerators([...communityData.moderators]);
        setFollowers([...communityData.followers]);
    }, [communityData]);

    const fetchModerators = async () => {
        try {
            const moderatorsData = [];
            for (const moderatorID of communityData.moderators) {
                const userDoc = await getDoc(doc(db, "users", moderatorID));
                if (userDoc.exists()) {
                    moderatorsData.push(userDoc.data());
                } else {
                    console.error(error);
                    continue;
                }
            }
            setModerators(moderatorsData);
        } catch (error) {
            console.error("Could not fetch moderators:", error);
        }
    };

    const fetchFollowers = async () => {
        try {
            const followersData = [];
            for (const followerID of communityData.followers) {
                const userDoc = await getDoc(doc(db, "users", followerID));
                if (userDoc.exists()) {
                    followersData.push(userDoc.data());
                } else {
                    console.error(error);
                    continue;
                }
            }
            setFollowers(followersData);
        } catch (error) {
            console.error("Could not fetch followers:", error);
        }
    };

    useEffect(() => {
        fetchModerators();
        fetchFollowers();
    }, [communityData.moderators, communityData.followers]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const notModerator = followers.filter(
        (follower) => !moderators.some((moderator) => moderator.uid === follower.uid)
    );

    const handleAddModerator = (follower) => {
        setSelectedFollower(follower);
        setShowAddModal(true);
    };

    const handleValidateChanges = async () => {
        try {
            const communityDoc = doc(db, "communities", communityData.id);
            await updateDoc(communityDoc, {
                moderators: arrayUnion(selectedFollower.uid),
            });
            setModerators((prevModerators) => [...prevModerators, selectedFollower]);
            setSelectedFollower(null);
            setShowAddModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const removeSelf = async () => {
        try {
            const communityDoc = doc(db, "communities", communityData.id);
            await updateDoc(communityDoc, {
                moderators: arrayRemove(userData.uid)
            })
            navigate(`/r/${communityData.url}`)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="border-b border-border pb-6">
                <h2 className="text-lg font-bold">Users Management</h2>
                <p className="text-sm text-muted">Manage followers and add new moderators.</p>
            </div>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Current moderators</span>
                        <span className="text-sm text-muted">Your community moderators (that's you!).</span>

                    </div>
                    <ul className="text-sm font-medium flex flex-col gap-3">
                        {moderators.map((moderator) => (
                            <li key={moderator.uid} className="flex items-center gap-2">
                                <img src={moderator.avatar} alt="" className="avatar-sm" />
                                {moderator.username}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Add new moderators</span>
                        <span className="text-sm text-muted">Pick from your followers and give them rights to update your community.</span>
                    </div>

                    <div className="text-sm font-medium border border-border rounded-md p-3 flex flex-col gap-3">
                        <div className="bg-secondaryHover rounded-md flex items-center gap-2 p-2">
                            <Search className="icon-xs text-muted" />
                            <input
                                type="text"
                                placeholder="Filter"
                                className="outline-none bg-transparent w-full placeholder:text-muted"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                        <ul className="flex flex-col max-h-24 overflow-y-auto">

                            {notModerator.length > 0 ? (
                                <ul className="flex flex-col max-h-24 overflow-y-auto">
                                    {notModerator.map((follower) => (
                                        follower && (
                                            <li
                                                key={follower.uid}
                                                className={`flex items-center gap-2 hover:bg-secondary rounded-md cursor-pointer p-2 ${follower.username && follower.username.toLowerCase().includes(searchQuery)
                                                    ? ""
                                                    : "hidden"
                                                    }`}
                                                onClick={() => handleAddModerator(follower)}
                                            >
                                                <img src={follower.avatar} alt="" className="avatar-sm" />
                                                {follower.username}
                                            </li>
                                        )
                                    ))}
                                </ul>
                            ) : (
                                <p className="ml-1">Looks like everyone's in.</p>
                            )}

                        </ul>

                        <Modal show={showAddModal} setShow={setShowAddModal}>
                            <ModalHeader>
                                Add {selectedFollower && selectedFollower.username} to moderators?
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-6 w-80">
                                    Once a user is added to the moderators list, you will not be able to remove them.
                                    <div className="space-x-2">
                                        <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
                                        <Button type="primary" onClick={handleValidateChanges}>Add {selectedFollower && selectedFollower.username}</Button>
                                    </div>
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Quit community moderators</span>
                        <span className="text-sm text-muted">There must be at least one other moderator for you to remove yourself from the moderators list. Once you remove yourself from moderators, you completely lose access to the Mod Tools. If you want to be a moderator again, you will have to be added manually by another moderator.</span>
                    </div>
                    <div>
                        <Button
                            type={moderators.length > 1 ? "danger" : "disabled"}
                            onClick={removeSelf}
                        >
                            Remove myself from moderators
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
