import { useState, useRef, useEffect } from "react";
import { Send, Mic, Sparkles, FileText, BarChart3, Shield, Clock, User, Bot, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/i18n/LanguageProvider";

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
    content: "Hello! I'm your AI assistant for KMRL DocHub. I can help you find documents, generate summaries, analyze compliance data, or answer questions about your system. How can I assist you today?",
    sender: "ai",
    timestamp: new Date(),
    type: "text"
  }
];

const quickActions = [
  { icon: FileText, label: "Find Documents", query: "Find safety documents from this week" },
  { icon: BarChart3, label: "Generate Report", query: "Generate compliance trend report" },
  { icon: Shield, label: "Check Compliance", query: "Show current compliance status" },
  { icon: Clock, label: "Pending Items", query: "What items need my approval?" }
];

const AIChatPage = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const clearChat = () => {
    setMessages(initialMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    
    if (input.includes("safety") || input.includes("safety documents")) {
      return "I found 12 safety documents from this week:\n\n• Safety Protocol Update - Station 12 (Critical)\n• Emergency Response Drill Report\n• Platform Safety Inspection - Station 8\n• Fire Safety Equipment Check\n\nThe critical item requires immediate attention. Would you like me to summarize it or route it for approval?";
    }
    
    if (input.includes("compliance") || input.includes("trend report")) {
      return "📊 **Compliance Trend Report (Q4 2024)**\n\n✅ Overall Score: 94.2% (↑2.1%)\n• CMRS Safety: 97% (Excellent)\n• Fire Safety: 89% (Good)\n• Environmental: 76% (Needs Attention)\n• Operational: 94% (Good)\n\n🔍 Key Insights:\n- Environmental compliance dropped 3% due to noise levels\n- Safety protocols improved significantly\n- 23 pending approvals need attention\n\nShould I generate a detailed action plan?";
    }
    
    if (input.includes("approval") || input.includes("pending")) {
      return "📋 **Pending Approvals Summary**\n\nYou have **23 items** awaiting approval:\n\n🔴 **High Priority (3)**\n• Safety Protocol Update - Station 12\n• Emergency Response Plan Revision\n• CMRS Compliance Report\n\n🟡 **Medium Priority (12)**\n• Maintenance schedules (8)\n• Training modules (4)\n\n🟢 **Low Priority (8)**\n• Procurement requests (5)\n• Documentation updates (3)\n\nOldest pending: 3 days ago. Would you like me to prioritize these by urgency or department?";
    }
    
    if (input.includes("status") || input.includes("current compliance")) {
      return "🛡️ **Current System Status**\n\n**Compliance Overview:**\n• Overall Score: 94.2%\n• Documents Processed Today: 127\n• Active Users: 89\n• System Uptime: 99.8%\n\n**Recent Activity:**\n• 3 new safety reports uploaded\n• 2 compliance audits completed\n• 15 AI summaries generated\n• 8 documents routed for approval\n\n**Alerts:**\n⚠️ Environmental compliance needs attention\n✅ All critical systems operational\n\nNeed details on any specific area?";
    }
    
    return "I understand you're looking for information. I can help you with:\n\n🔍 **Document Management**\n- Search and find documents\n- Generate AI summaries\n- Route for approvals\n\n📊 **Analytics & Reports**\n- Compliance trends\n- Performance metrics\n- Custom reports\n\n⚡ **Quick Actions**\n- Check pending items\n- System status updates\n- Priority notifications\n\nWhat would you like to explore?";
  };

  const handleQuickAction = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">{t('ai_assistant_title')}</h1>
        <p className="text-lg text-muted-foreground">
          Intelligent document analysis and system insights
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Quick Actions Sidebar */}
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => handleQuickAction(action.query)}
              >
                <action.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-3 order-1 lg:order-2">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">KMRL AI Assistant</CardTitle>
                <p className="text-sm text-muted-foreground">Powered by DocHub Intelligence</p>
              </div>
              <div className="ml-auto flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
                <Badge variant="outline">
                  Online
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Container */}
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-line">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 opacity-70 ${
                      message.sender === "user" ? "text-primary-foreground" : "text-muted-foreground"
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-muted">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-muted/30">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about documents, compliance, analytics, or system status..."
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
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIChatPage;