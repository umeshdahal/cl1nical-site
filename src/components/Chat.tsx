import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, File, Image, Download, X, Smile, Search, MessageSquare, Bot } from 'lucide-react';

interface ChatProps {
  darkMode: boolean;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  files?: ChatFile[];
  isOwn: boolean;
  isAI?: boolean;
}

interface ChatFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastMessage?: string;
  unread?: number;
  isAI?: boolean;
}

const mockContacts: Contact[] = [
  { id: 'ai', name: 'AI Assistant', avatar: 'AI', status: 'online', lastMessage: 'How can I help you?', isAI: true },
  { id: '1', name: 'Alice Chen', avatar: 'AC', status: 'online', lastMessage: 'Hey, check out this file!', unread: 2 },
  { id: '2', name: 'Bob Smith', avatar: 'BS', status: 'away', lastMessage: 'Thanks for the help!' },
  { id: '3', name: 'Carol Davis', avatar: 'CD', status: 'online', lastMessage: 'Meeting at 3pm?', unread: 1 },
  { id: '4', name: 'Dev Team', avatar: 'DT', status: 'online', lastMessage: 'Deploy complete', unread: 5 },
  { id: '5', name: 'Eve Wilson', avatar: 'EW', status: 'offline', lastMessage: 'See you tomorrow' },
];

const initialMessages: Record<string, Message[]> = {
  'ai': [
    { id: '1', sender: 'AI Assistant', text: 'Hello! I\'m your AI assistant. I can help you with coding questions, explain concepts, or just chat. What would you like to know?', timestamp: '10:00 AM', isOwn: false, isAI: true },
  ],
  '1': [
    { id: '1', sender: 'Alice Chen', text: 'Hey! How are you doing?', timestamp: '10:30 AM', isOwn: false },
    { id: '2', sender: 'You', text: 'I\'m good, thanks! Working on the new project.', timestamp: '10:32 AM', isOwn: true },
    { id: '3', sender: 'Alice Chen', text: 'Nice! I have some files to share with you.', timestamp: '10:33 AM', isOwn: false },
    { id: '4', sender: 'Alice Chen', text: 'Here are the design mockups:', timestamp: '10:33 AM', isOwn: false, files: [{ name: 'mockups-v2.fig', size: 2400000, type: 'file', url: '#' }] },
  ],
  '2': [
    { id: '1', sender: 'Bob Smith', text: 'Can you help me with the API integration?', timestamp: '9:15 AM', isOwn: false },
    { id: '2', sender: 'You', text: 'Sure! What do you need help with?', timestamp: '9:20 AM', isOwn: true },
    { id: '3', sender: 'Bob Smith', text: 'Thanks for the help!', timestamp: '9:45 AM', isOwn: false },
  ],
};

// OpenRouter API configuration
const OPENROUTER_API_KEY = ''; // Add your API key here
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free models available on OpenRouter
const AI_MODELS = [
  'google/gemma-3-1b-it:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'qwen/qwen-2.5-7b-instruct:free',
];

export default function Chat({ darkMode }: ChatProps) {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<ChatFile[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact, isTyping]);

  // Clear unread when selecting a contact
  useEffect(() => {
    if (selectedContact) {
      setContacts(prev => prev.map(c => 
        c.id === selectedContact ? { ...c, unread: 0 } : c
      ));
    }
  }, [selectedContact]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    if (!OPENROUTER_API_KEY) {
      // Fallback responses when no API key is set
      const responses = [
        "That's an interesting question! Let me think about it...",
        "I'd be happy to help with that. Could you provide more details?",
        "Great question! Here's what I know about that topic...",
        "I understand what you're asking. Let me break it down for you.",
        "That's a complex topic. Here's my take on it...",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'cl1nical Chat',
        },
        body: JSON.stringify({
          model: AI_MODELS[Math.floor(Math.random() * AI_MODELS.length)],
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant integrated into cl1nical, a productivity dashboard. Be concise, friendly, and helpful. You can help with coding, productivity tips, and general questions.' },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 500,
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      return data.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.error('AI response error:', error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    if (!selectedContact) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      files: selectedFiles.length > 0 ? selectedFiles : undefined,
      isOwn: true,
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), userMessage],
    }));
    setNewMessage('');
    setSelectedFiles([]);

    // Update last message in contacts
    setContacts(prev => prev.map(c => 
      c.id === selectedContact ? { ...c, lastMessage: newMessage || 'File shared' } : c
    ));

    // If chatting with AI, get response
    const contact = contacts.find(c => c.id === selectedContact);
    if (contact?.isAI) {
      setIsTyping(true);
      const aiResponse = await getAIResponse(newMessage);
      setIsTyping(false);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'AI Assistant',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        isAI: true,
      };

      setMessages(prev => ({
        ...prev,
        [selectedContact]: [...(prev[selectedContact] || []), aiMessage],
      }));

      setContacts(prev => prev.map(c => 
        c.id === selectedContact ? { ...c, lastMessage: aiResponse.substring(0, 50) + '...' } : c
      ));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: ChatFile[] = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      url: URL.createObjectURL(file),
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = selectedContact ? (messages[selectedContact] || []) : [];
  const currentContact = contacts.find(c => c.id === selectedContact);

  return (
    <div className={`h-[calc(100vh-200px)] flex rounded-xl overflow-hidden border ${darkMode ? 'border-white/[0.08]' : 'border-gray-200'}`}>
      {/* Contacts Sidebar */}
      <div className={`w-72 border-r flex flex-col ${darkMode ? 'border-white/[0.08] bg-white/[0.02]' : 'border-gray-200 bg-gray-50'}`}>
        <div className="p-4">
          <div className="relative">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-white/30' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none ${
                darkMode ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30' : 'bg-white border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
              }`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`w-full p-4 flex items-center gap-3 transition-all ${
                selectedContact === contact.id
                  ? darkMode ? 'bg-white/[0.08]' : 'bg-indigo-50'
                  : darkMode ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-100'
              }`}
            >
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  contact.isAI 
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white'
                    : darkMode ? 'bg-white/[0.1] text-white' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {contact.isAI ? <Bot size={18} /> : contact.avatar}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
                  darkMode ? 'border-[#0a0a0a]' : 'border-gray-50'
                } ${
                  contact.status === 'online' ? 'bg-green-500' :
                  contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{contact.name}</p>
                <p className={`text-xs truncate ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{contact.lastMessage}</p>
              </div>
              {contact.unread && contact.unread > 0 ? (
                <span className="w-5 h-5 bg-indigo-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {contact.unread}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact && currentContact ? (
          <>
            {/* Chat Header */}
            <div className={`p-4 border-b flex items-center gap-3 ${darkMode ? 'border-white/[0.08] bg-white/[0.02]' : 'border-gray-200 bg-white'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                currentContact.isAI 
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white'
                  : darkMode ? 'bg-white/[0.1] text-white' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {currentContact.isAI ? <Bot size={18} /> : currentContact.avatar}
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentContact.name}</p>
                <p className={`text-xs ${currentContact.status === 'online' ? 'text-green-500' : darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                  {currentContact.isAI ? 'AI Assistant' : currentContact.status === 'online' ? 'Online' : currentContact.status === 'away' ? 'Away' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-white/[0.01]' : 'bg-gray-50'}`}>
              {currentMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${msg.isOwn ? 'order-2' : ''}`}>
                    <div className={`px-4 py-2.5 rounded-2xl ${
                      msg.isOwn
                        ? 'bg-indigo-500 text-white rounded-br-md'
                        : msg.isAI
                        ? darkMode ? 'bg-purple-500/20 border border-purple-500/30 text-white rounded-bl-md' : 'bg-purple-50 border border-purple-200 text-gray-900 rounded-bl-md'
                        : darkMode ? 'bg-white/[0.08] text-white rounded-bl-md' : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      {msg.files && msg.files.map((file, i) => (
                        <div key={i} className={`mt-2 p-2 rounded-lg flex items-center gap-2 ${
                          msg.isOwn ? 'bg-white/20' : darkMode ? 'bg-white/[0.06]' : 'bg-gray-100'
                        }`}>
                          {file.type === 'image' ? <Image size={16} /> : <File size={16} />}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{file.name}</p>
                            <p className={`text-[10px] ${msg.isOwn ? 'text-white/70' : darkMode ? 'text-white/40' : 'text-gray-500'}`}>
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <a href={file.url} download={file.name} className={`p-1 rounded ${msg.isOwn ? 'hover:bg-white/20' : darkMode ? 'hover:bg-white/[0.1]' : 'hover:bg-gray-200'}`}>
                            <Download size={14} />
                          </a>
                        </div>
                      ))}
                    </div>
                    <p className={`text-[10px] mt-1 ${msg.isOwn ? 'text-right' : ''} ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`px-4 py-3 rounded-2xl rounded-bl-md ${darkMode ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* File Preview */}
            {selectedFiles.length > 0 && (
              <div className={`px-4 py-2 border-t flex gap-2 overflow-x-auto ${darkMode ? 'border-white/[0.08] bg-white/[0.02]' : 'border-gray-200 bg-white'}`}>
                {selectedFiles.map((file, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                    darkMode ? 'bg-white/[0.08] text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {file.type === 'image' ? <Image size={14} /> : <File size={14} />}
                    <span className="truncate max-w-[100px]">{file.name}</span>
                    <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-300">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Message Input */}
            <div className={`p-4 border-t ${darkMode ? 'border-white/[0.08] bg-white/[0.02]' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/[0.1] text-white/50' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <Paperclip size={18} />
                </button>
                <button
                  className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/[0.1] text-white/50' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <Smile size={18} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder={currentContact.isAI ? "Ask me anything..." : "Type a message..."}
                  className={`flex-1 px-4 py-2 border rounded-xl text-sm outline-none ${
                    darkMode ? 'bg-white/[0.04] border-white/[0.08] focus:border-white/[0.2] text-white placeholder:text-white/30' : 'bg-gray-50 border-gray-200 focus:border-indigo-300 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() && selectedFiles.length === 0}
                  className={`p-2.5 rounded-xl transition-all disabled:opacity-50 ${
                    darkMode ? 'bg-white/[0.1] hover:bg-white/[0.15] text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className={`mx-auto mb-4 ${darkMode ? 'text-white/20' : 'text-gray-300'}`} />
              <p className={`text-lg font-medium ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>Select a conversation</p>
              <p className={`text-sm ${darkMode ? 'text-white/20' : 'text-gray-400'}`}>Choose a contact or AI assistant to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
