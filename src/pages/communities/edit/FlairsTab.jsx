import { Button } from "@components/ui/Button"
import { Input } from "@components/ui/Input"
import { CheckCircle, Loader2, Pen, Trash, X } from "lucide-react"
import { useState, useEffect } from "react"
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@utils/firebase";

export const FlairsTab = ({ communityData }) => {

  const [newFlair, setNewFlair] = useState("");
  const [flairs, setFlairs] = useState([...communityData.flairs]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedFlair, setEditedFlair] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);

  useEffect(() => {
    setFlairs([...communityData.flairs]);
  }, [communityData]);

  const deleteFlair = (index) => {
    const updatedFlairs = [...flairs];
    updatedFlairs.splice(index, 1);
    setFlairs(updatedFlairs);
  };

  const addFlair = () => {
    if (newFlair !== "") {
      setFlairs([...flairs, newFlair]);
      setNewFlair("");
      setError("");
    } else {
      setError("Flair cannot be empty.");
    }
  }
  const editFlair = (index) => {
    setIsEditing(index);
    setEditedFlair(flairs[index]);
    setError("");
  };

  const updateEditedFlair = () => {
    if (editedFlair.trim() !== "") {
      const updatedFlairs = [...flairs];
      updatedFlairs[isEditing] = editedFlair.trim();
      setFlairs(updatedFlairs);
      setIsEditing(null);
      setEditedFlair("");
    } else {
      setError("Flair cannot be empty.");
    }
  };

  const exitEditingState = () => {
    setIsEditing(null);
    setEditedFlair("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const communityDoc = doc(db, "communities", communityData.id);
      await updateDoc(communityDoc, {
        flairs: flairs,
      });
      setChangesSaved(true);
    } catch (error) {
      console.error("Could not update flairs:", error);
      setError("Error updating flairs. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col gap-6">
      <div className="border-b border-border pb-6">
        <h2 className="text-lg font-bold">Post Flairs</h2>
        <p className="text-sm text-muted">Create and manage post flairs.</p>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Current flairs</span>
            <span className="text-sm text-muted">Your community post flairs.</span>
          </div>
          {flairs.length > 0 ? (
            <ul className="space-y-2">
              {flairs.map((flair, index) => (
                <li key={index} className="flex items-center gap-2">
                  {isEditing === index ? (
                    <>
                      <CheckCircle
                        className="icon-xs text-faint cursor-pointer"
                        onClick={updateEditedFlair}
                      />
                      <X
                        className="icon-xs text-faint cursor-pointer"
                        onClick={exitEditingState}
                      />
                      <Input
                        type="text"
                        value={editedFlair}
                        error={error}
                        onChange={(e) => setEditedFlair(e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <Pen
                        className="icon-xs text-faint cursor-pointer"
                        onClick={() => editFlair(index)}
                      />
                      <Trash
                        className="icon-xs text-faint cursor-pointer"
                        onClick={() => deleteFlair(index)}
                      />
                      <span className="flair w-fit">{flair}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-sm font-medium">No post flairs for this community.</span>
          )}

        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium">New flair</span>
            <span className="text-sm text-muted">Create flairs your followers can use to categorize posts.</span>
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              value={newFlair}
              error={error}
              onChange={(e) => setNewFlair(e.target.value)}
            />
            <div className="btn-secondary" onClick={addFlair}>
              Add Flair
            </div>
          </div>
        </div>

        <div>
          <Button
            onClick={handleSubmit}
            type={loading ? "loading" : (changesSaved ? "success" : "primary")}
          >
            {loading ? (
              <>
                <Loader2 className="icon-xs animate-spin" />
                Loading...
              </>
            ) : changesSaved ? (
              <>
                <CheckCircle className="icon-xs" />
                Changes Saved!
              </>
            ) : (
              <>Update Flairs</>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
