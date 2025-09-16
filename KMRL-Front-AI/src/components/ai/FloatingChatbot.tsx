import { useState } from "react";
import { MessageSquare, X, Send, Mic, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "suggestion" | "action";
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm your AI assistant for KMRL DocHub. I can help you find documents, generate summaries, or answer questions about your system. How can I assist you today?",
    sender: "ai",
    timestamp: new Date(),
    type: "text"
  }
];

const suggestions = [
  "Summarize today's safety reports",
  "Find compliance documents for CMRS",
  "Show pending approvals",
  "Generate maintenance trend report"
];

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const clearChat = () => {
    setMessages(initialMessages);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(content),
        sender: "ai",
        timestamp: new Date(),
        type: "text"
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("safety") || input.includes("safety reports")) {
      return "I found 3 safety reports from today. The critical one is 'Safety Protocol Update - Station 12' which requires immediate attention. Would you like me to summarize it or route it to the appropriate personnel?";
    }
    
    if (input.includes("compliance") || input.includes("cmrs")) {
      return "Here are the latest CMRS compliance documents: 1) CMRS Compliance Audit Findings (94% score) 2) Safety Protocol Updates 3) Quarterly Safety Review. Your current compliance score is 94.2%. Need help with any specific compliance area?";
    }
    
    if (input.includes("pending") || input.includes("approvals")) {
      return "You have 23 documents pending approval: 8 safety protocols, 7 maintenance reports, 5 procurement requests, and 3 training modules. The oldest pending item is from 3 days ago. Would you like me to prioritize these by urgency?";
    }
    
    if (input.includes("maintenance") || input.includes("trend")) {
      return "Based on Q3 maintenance data: Rolling stock availability is 96.2% (↑2.1%), predictive maintenance alerts reduced by 15%, and overall system efficiency improved by 8%. I can generate a detailed trend analysis report. Should I proceed?";
    }
    
    return "I understand you're looking for information. I can help you with document searches, generating summaries, routing approvals, compliance checks, or analytics. Could you be more specific about what you need assistance with?";
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 transition-all duration-300 ${
          isOpen ? "scale-0" : "scale-100"
        } bg-primary hover:bg-primary/90 group`}
      >
        <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-priority-critical rounded-full animate-pulse" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } border-primary/20`}>
          <CardHeader className="pb-3 bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">KMRL AI Assistant</CardTitle>
                  <p className="text-xs opacity-90">Powered by DocHub Intelligence</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col h-[400px] p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-6 w-6 mt-1">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <Avatar className="h-6 w-6 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                <div className="flex flex-col gap-1">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs h-8 justify-start px-2 text-left whitespace-normal"
                    >
                      <span className="truncate">{suggestion}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about documents, compliance, or analytics..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon"
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default FloatingChatbot;