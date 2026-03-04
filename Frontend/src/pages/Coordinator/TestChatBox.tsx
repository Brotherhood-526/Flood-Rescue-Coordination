import ChatBox, {type MessageComponent} from "@/layouts/ChatBox.tsx";
import {useState} from "react";
import {Card} from "@/components/ui/card.tsx";

const mockMessages: MessageComponent[] = [
    { content: "Hello world", time: "10:30 AM", name: "Điều phối viên" },
    { content: "Chúng tôi đã tới nơi", time: "10:31 AM", name: "Đội cứu hộ" },
    { content: "Ok giữ liên lạc", time: "10:32 AM", name: "Điều phối viên" },
];

export default function TestChatBox(){
    const [messages, setMessages] = useState<MessageComponent[]>(mockMessages);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row">
                <Card className="w-[50vw] h-[80vh] p-0">
                    <ChatBox title={"Test chat box"} messages={messages} setMessages={setMessages} senderName={"Điều phối viên"}/>
                </Card>
                <Card className="w-[50vw] h-[80vh] p-0">
                    <ChatBox title={"Test chat box"} messages={messages} setMessages={setMessages} senderName={"Đội cứu hộ"}/>
                </Card>

            </div>
            <Card className="w-[100vw] h-[80vh] p-0">
                <ChatBox title={"Test chat box"} messages={messages} setMessages={setMessages} senderName={"Hacker"}/>
            </Card>
        </div>
    );
}