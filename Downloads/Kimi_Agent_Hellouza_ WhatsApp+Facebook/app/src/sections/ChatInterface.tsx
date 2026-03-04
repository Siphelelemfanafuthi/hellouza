import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Camera, 
  Mic, 
  Send,
  Smile,
  CheckCheck,
  ArrowLeft
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const chatList = [
  { id: 1, name: 'Sarah Chen', avatar: '/avatar_1.jpg', lastMessage: 'See you tomorrow! 🎉', time: '2m', unread: 2, online: true },
  { id: 2, name: 'Michael Torres', avatar: '/avatar_2.jpg', lastMessage: 'Thanks for the help!', time: '15m', unread: 0, online: true },
  { id: 3, name: 'Emma Wilson', avatar: '/avatar_3.jpg', lastMessage: 'Can we reschedule?', time: '1h', unread: 1, online: false },
  { id: 4, name: 'David Kim', avatar: '/avatar_4.jpg', lastMessage: 'The photos look great!', time: '2h', unread: 0, online: true },
  { id: 5, name: 'Lisa Park', avatar: '/avatar_5.jpg', lastMessage: 'Let me check...', time: '3h', unread: 0, online: false },
  { id: 6, name: 'John Smith', avatar: '/avatar_6.jpg', lastMessage: 'Sounds good!', time: '5h', unread: 0, online: false },
];

const messages = [
  { id: 1, text: 'Hey! How are you doing?', sent: false, time: '10:30 AM' },
  { id: 2, text: 'I\'m great! Just finished a big project at work 🎉', sent: true, time: '10:32 AM', read: true },
  { id: 3, text: 'That\'s awesome! Congratulations!', sent: false, time: '10:33 AM' },
  { id: 4, text: 'We should celebrate this weekend!', sent: false, time: '10:33 AM' },
  { id: 5, text: 'Definitely! How about Saturday dinner?', sent: true, time: '10:35 AM', read: true },
  { id: 6, text: 'Perfect! I know a great Italian place 🍝', sent: false, time: '10:36 AM' },
  { id: 7, text: 'Can\'t wait! See you tomorrow!', sent: true, time: '10:38 AM', read: true },
];

export default function ChatInterface() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedChat, setSelectedChat] = useState(chatList[0]);
  const [newMessage, setNewMessage] = useState('');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.animate-item'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section" style={{ 
      background: 'var(--bg-dark)', 
      padding: '40px 24px',
      minHeight: 'auto'
    }}>
      <div className="container">
        <div className="animate-item" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
            Chat Interface Preview
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
            Experience seamless messaging with Hellouza
          </p>
        </div>

        {/* Chat Interface Mockup */}
        <div className="animate-item" style={{
          maxWidth: '900px',
          margin: '0 auto',
          height: '500px',
          background: '#111B21',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
        }}>
          {/* Chat List Sidebar */}
          <div style={{
            width: '320px',
            background: '#111B21',
            borderRight: '1px solid #222D34',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Search Header */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #222D34' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#202C33',
                padding: '8px 14px',
                borderRadius: '10px'
              }}>
                <Search size={18} style={{ color: '#8696A0' }} />
                <input 
                  type="text" 
                  placeholder="Search or start new chat"
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    fontSize: '14px',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            {/* Chat List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {chatList.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: selectedChat.id === chat.id ? '#2A3942' : 'transparent',
                    borderBottom: '1px solid #222D34'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img src={chat.avatar} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                    {chat.online && <div className="online-indicator" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <p style={{ color: 'white', fontWeight: 500, fontSize: '15px' }}>{chat.name}</p>
                      <span style={{ color: '#8696A0', fontSize: '12px' }}>{chat.time}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ color: '#8696A0', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span style={{
                          background: '#00A884',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 7px',
                          borderRadius: '10px'
                        }}>
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Chat */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <div style={{
              padding: '10px 16px',
              background: '#202C33',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <ArrowLeft size={22} style={{ color: '#AEBAC1', cursor: 'pointer', display: 'none' }} />
              <div style={{ position: 'relative' }}>
                <img src={selectedChat.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                {selectedChat.online && <div className="online-indicator" />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontWeight: 500, fontSize: '15px' }}>{selectedChat.name}</p>
                <p style={{ color: '#8696A0', fontSize: '12px' }}>{selectedChat.online ? 'online' : 'last seen recently'}</p>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <Video size={22} style={{ color: '#AEBAC1', cursor: 'pointer' }} />
                <Phone size={22} style={{ color: '#AEBAC1', cursor: 'pointer' }} />
                <MoreVertical size={22} style={{ color: '#AEBAC1', cursor: 'pointer' }} />
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              padding: '20px',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23222d34\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.sent ? 'flex-end' : 'flex-start',
                    maxWidth: '65%'
                  }}
                >
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: msg.sent ? '#005C4B' : '#202C33',
                      borderBottomRightRadius: msg.sent ? '2px' : '10px',
                      borderBottomLeftRadius: msg.sent ? '10px' : '2px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                  >
                    <p style={{ fontSize: '14px', color: 'white', lineHeight: 1.4 }}>{msg.text}</p>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'flex-end',
                      gap: '4px',
                      marginTop: '2px'
                    }}>
                      <span style={{ fontSize: '10px', color: '#AEBAC1' }}>{msg.time}</span>
                      {msg.sent && (
                        msg.read ? 
                          <CheckCheck size={12} style={{ color: '#53BDEB' }} /> :
                          <CheckCheck size={12} style={{ color: '#AEBAC1' }} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{
              padding: '10px 16px',
              background: '#202C33',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Smile size={24} style={{ color: '#8696A0', cursor: 'pointer' }} />
              <Paperclip size={24} style={{ color: '#8696A0', cursor: 'pointer' }} />
              <Camera size={24} style={{ color: '#8696A0', cursor: 'pointer' }} />
              <div style={{
                flex: 1,
                background: '#2A3942',
                borderRadius: '10px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    fontSize: '14px',
                    width: '100%'
                  }}
                />
              </div>
              {newMessage ? (
                <Send size={24} style={{ color: '#00A884', cursor: 'pointer' }} />
              ) : (
                <Mic size={24} style={{ color: '#8696A0', cursor: 'pointer' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
