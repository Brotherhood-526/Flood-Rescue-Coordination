import { ImageUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {useState, useEffect, useRef} from "react";
import {Textarea} from "@/components/ui/textarea.tsx";

export type MessageComponent = {
    content?: string;
    time: string;
    name: string;
};

type TestChatBoxProps = {
    title: string;
    senderName: string;
    messages: MessageComponent[];
    setMessages: React.Dispatch<React.SetStateAction<MessageComponent[]>>;
    className?: string;
    messageClassName?: string;
};

type MessageProps = {
    message: MessageComponent;
    senderName: string;
    className?: string;
};

type ChatInputProps = {
    onSend: (content: string) => void;
};

/* ---------------- MAIN COMPONENT ----------------*/

export default function ChatBox({ title, senderName, messages, setMessages, className, messageClassName }: TestChatBoxProps) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (content: string) => {
        const newMessage: MessageComponent = {
            content,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            name: senderName,
        };

        setMessages([...messages, newMessage]);
    };

    return (
        <div className={`flex flex-col w-full h-full ${className}`}>

            {/* Header */}
            <div className="flex items-center justify-center h-[15%] max-h-[8vh] min-h-[5vh] bg-black text-white font-bold text-[1.3em]">
                {title}
            </div>

            {/* Messages */}
            <div className="flex-1 flex flex-col overflow-y-auto px-[1em] py-[0.8em] gap-[0.6em]">
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} senderName={senderName} className={messageClassName} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div>
                <ChatInput onSend={handleSend}/>
            </div>
        </div>
    );
}

/* ---------------- MESSAGE ---------------- */

function Message({ message, senderName, className }: MessageProps) {
    const isSender = message.name === senderName;

    return (
        <div className={`flex flex-col w-full ${isSender? "items-end" : "items-start"}`}>

            <div className={`text-[0.75em] text-gray-500 mb-[0.3em] ${isSender ? "text-right pr-[0.8em]" : "text-left pl-[0.8em]"}`}>
                {message.name} • {message.time}
            </div>

            <div className={`max-w-[70%] px-[1em] py-[0.6em] rounded-[1.2em] ${isSender ? "rounded-br-[0.4em] bg-blue-600" : "rounded-bl-[0.4em] bg-indigo-600"} text-[0.95em] leading-relaxed break-words ${className} text-white`}>
                {message.content}
            </div>

        </div>
    );
}

function ChatInput({ onSend }: ChatInputProps) {
    const [value, setValue] = useState("");

    const handleSend = () => {
        if (!value.trim()) return;

        onSend(value.trim());
        setValue("");
    };

    return (
        <div className="flex items-center gap-[0.6em] px-[1em] py-[0.6em] border-t bg-white">

            {/*<Input*/}
            {/*    value={value}*/}
            {/*    onChange={(e) => setValue(e.target.value)}*/}
            {/*    onKeyDown={(e) => {*/}
            {/*        if (e.key === "Enter") {*/}
            {/*            e.preventDefault();*/}
            {/*            handleSend();*/}
            {/*        }*/}
            {/*    }}*/}
            {/*    placeholder="Nhập tin nhắn tại đây..."*/}
            {/*    className="flex-1 bg-gray-100 border-none focus-visible:ring-0 text-[0.95em]"*/}
            {/*/>*/}

            <Textarea
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                    e.target.style.height = "auto"
                    e.target.style.height = e.target.scrollHeight + "px"
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                    }
                }}
                placeholder="Nhập tin nhắn tại đây..."
                rows={1}
                className="flex-1 bg-gray-100 border-none focus-visible:ring-0 text-[0.95em] resize-none overflow-hidden"
            />

            <ImageUp className="w-5 h-5 cursor-pointer" />

            <Button
                onClick={handleSend}
                disabled={!value.trim()}
                className="bg-red-600 hover:bg-red-700 text-white px-[1em] cursor-pointer"
            >
                Gửi
            </Button>

        </div>
    );
}
