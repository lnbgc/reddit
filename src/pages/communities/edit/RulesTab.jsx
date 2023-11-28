import React, { useState, useEffect } from "react";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { CheckCircle, Loader2, Pen, Trash, X } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@utils/firebase";
import { Textarea } from "@components/ui/Textarea";

export const RulesTab = ({ communityData }) => {

    const [newRule, setNewRule] = useState({ title: "", content: "" });
    const [rules, setRules] = useState([...communityData.rules]);
    const [isEditing, setIsEditing] = useState(null);
    const [editedRule, setEditedRule] = useState({ title: "", content: "" });


    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [changesSaved, setChangesSaved] = useState(false);

    useEffect(() => {
        setRules([...communityData.rules]);
    }, [communityData]);

    const deleteRule = (index) => {
        const updatedRules = [...rules];
        updatedRules.splice(index, 1);
        setRules(updatedRules);
    };

    const addRule = () => {
        if (newRule.title.trim() !== "" && newRule.content.trim() !== "") {
            setRules([...rules, newRule]);
            setNewRule({ title: "", content: "" });
            setError("");
        } else {
            setError("Title and content cannot be empty.");
        }
    };

    const editRule = (index) => {
        setIsEditing(index);
        setEditedRule(rules[index]);
        setError("");
    };

    const updateEditedRule = () => {
        if (editedRule.title.trim() !== "" && editedRule.content.trim() !== "") {
            const updatedRules = [...rules];
            updatedRules[isEditing] = editedRule;
            setRules(updatedRules);
            setIsEditing(null);
            setEditedRule({ title: "", content: "" });
        } else {
            setError("Title and content cannot be empty.");
        }
    };

    const exitEditingState = () => {
        setIsEditing(null);
        setEditedRule({ title: "", content: "" });
    };

    const editRuleContent = (value) => {
        setEditedRule({
            ...editedRule,
            content: value,
        });
    };

    const newRuleContent = (value) => {
        setNewRule({
            ...newRule,
            content: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const communityDoc = doc(db, "communities", communityData.id);
            await updateDoc(communityDoc, {
                rules: rules,
            });
            setChangesSaved(true);
        } catch (error) {
            console.error("Could not update rules:", error);
            setError("Error updating rules. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="flex flex-col gap-6">
            <div className="border-b border-border pb-6">
                <h2 className="text-lg font-bold">Community Rules</h2>
                <p className="text-sm text-muted">Create and manage community rules.</p>
            </div>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Current rules</span>
                        <span className="text-sm text-muted">Your community rules.</span>
                    </div>
                    {rules.length > 0 ? (
                        <ul className="flex flex-col gap-3">
                            {rules.map((rule, index) => (
                                <li key={index}>
                                    {isEditing === index ? (
                                        <>

                                            <div className="flex gap-3 border-b border-border pb-3">
                                                <div className="flex gap-2">
                                                    <CheckCircle className="icon-xs text-faint cursor-pointer" onClick={updateEditedRule} />
                                                    <X className="icon-xs text-faint cursor-pointer" onClick={exitEditingState} />
                                                </div>
                                                <div className="flex flex-col gap-3 border-l border-border pl-3 w-full">
                                                    <Input
                                                        type="text"
                                                        label="Title"
                                                        error={error}
                                                        value={editedRule.title}
                                                        onChange={(e) =>
                                                            setEditedRule({
                                                                ...editedRule,
                                                                title: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <Textarea
                                                        label="Description"
                                                        error={error}
                                                        value={editedRule.content}
                                                        onChange={editRuleContent}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex gap-3 border-b border-border pb-3">
                                            <div className="flex gap-2">
                                                <Pen className="icon-xs text-faint cursor-pointer" onClick={() => editRule(index)} />
                                                <Trash className="icon-xs text-faint cursor-pointer" onClick={() => deleteRule(index)} />
                                            </div>
                                            <div className="flex flex-col gap-3 border-l border-border pl-3 text-sm">
                                                <p className="font-bold">{rule.title}</p>
                                                <p>{rule.content}</p>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span className="text-sm font-medium">No rules for this community.</span>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">New rule</span>
                        <span className="text-sm text-muted">Create new community rules.</span>
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="text"
                            label="Title"
                            value={newRule.title}
                            onChange={(e) =>
                                setNewRule({ ...newRule, title: e.target.value })
                            }
                        />
                        <Textarea
                            label="Description"
                            value={newRule.content}
                            onChange={newRuleContent}
                        />
                        <div className="btn-secondary" onClick={addRule}>
                            Add Rule
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
                            <>Update Rules</>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
};


