import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export const Modal = ({ show, setShow, children }) => {
    const modalRef = useRef();

    const closeModal = () => {
        setShow(false);
    };

    const handleEscapeKey = (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    };

    useEffect(() => {
        const clickOutside = (e) => {
            if (e.target === modalRef.current) {
                closeModal();
            }
        };
        window.addEventListener("click", clickOutside);
        window.addEventListener("keydown", handleEscapeKey);
        return () => {
            window.removeEventListener("click", clickOutside);
            window.removeEventListener("keydown", handleEscapeKey);
        };
    }, [setShow]);

    return (
        <div className={`modal left-0 top-0 w-screen h-screen bg-black/40 fixed ${show && "active"}`}>
            <div
                className={`placement flex items-center justify-center h-screen transition-transform duration-500 ease-in-out transform ${
                    show ? "translate-y-0" : "-translate-y-10"
                }`}
                ref={modalRef}
            >
                <div className="bg-primary text-normal rounded-lg p-10 flex flex-col border border-border">
                    <div className="self-end text-faint cursor-pointer rounded-md hover:bg-secondary hover:text-normal transition duration-300 p-1">
                        <X onClick={() => setShow(false)} className="w-5 h-5" />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export const ModalBody = ({ children }) => {
    return <div>{children}</div>;
};

export const ModalHeader = ({ children }) => {
    return <div className="mb-8 font-bold text-xl">{children}</div>;
};