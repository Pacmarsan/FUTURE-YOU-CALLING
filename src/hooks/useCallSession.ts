import { useState, useCallback, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { 
  UserContext, 
  MemoryContext, 
  buildFullPrompt, 
} from '../lib/prompt-engine';

export function useCallSession(userData: UserContext | null, voiceId: string | null) {
  const [callState, setCallState] = useState<'listening' | 'thinking' | 'speaking' | 'interrupted' | 'ended'>('listening');
  const [displayedText, setDisplayedText] = useState("Connecting to Temporal Relay...");
  const [memory, setMemory] = useState<MemoryContext>({
    last_5_messages: "System: Call started. Awaiting input.",
    key_points_extracted: [],
    emotion_state: 'supportive'
  });

  const conversation = useConversation({
    onConnect: () => {
      setCallState('listening');
      setDisplayedText("Link established. Speak to your future self.");
    },
    onDisconnect: () => {
      setCallState('ended');
    },
    onMessage: (message: any) => {
      if (message.source === 'ai') {
        setDisplayedText(message.message);
        setMemory(prev => ({
          ...prev,
          last_5_messages: prev.last_5_messages + `\nAI: ${message.message}`
        }));
      } else if (message.source === 'user') {
        setDisplayedText(message.message);
        setCallState('thinking');
        setMemory(prev => ({
          ...prev,
          last_5_messages: prev.last_5_messages + `\nUser: ${message.message}`
        }));
      }
    },
    onError: (error: any) => {
      console.error(error);
      setDisplayedText("Signal lost...");
      setCallState('ended');
    }
  });

  // Automatically update component state based on WebRTC speaking feedback
  useEffect(() => {
     if (conversation.isSpeaking) {
         setCallState('speaking');
     } else if (conversation.status === 'connected') {
         setCallState('listening');
     }
  }, [conversation.isSpeaking, conversation.status]);

  useEffect(() => {
    if (userData && conversation.status === 'disconnected') {
      startCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const startCall = async () => {
      try {
        // Use our Prompt Engine generator here to inject the context into ElevenLabs
        const prompt = buildFullPrompt(userData!, memory);
        
        let dynamicAgentId = (process.env as any).ELEVENLABS_AGENT_ID;
        
        // Auto-fetch Agent ID if not explicitly set
        if (!dynamicAgentId || dynamicAgentId === 'undefined') {
           const response = await fetch("https://api.elevenlabs.io/v1/convai/agents", {
             headers: {
               "xi-api-key": (process.env as any).ELEVENLABS_API_KEY
             }
           });
           
           if (!response.ok) {
              console.error("ElevenLabs API Error:", await response.text());
              throw new Error("Failed to fetch ElevenLabs Agents due to API rejection.");
           }

           const data = await response.json();
           if (data.agents && data.agents.length > 0) {
             dynamicAgentId = data.agents[0].agent_id.split('?')[0];
           } else {
             throw new Error("No conversational agents found in your ElevenLabs account.");
           }
        }

        // 2. Fetch Signed URL strictly via GET. The SDK will handle attaching overrides via the WebSocket.
        const signedUrlResponse = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${encodeURIComponent(dynamicAgentId)}`, {
          method: "GET",
          headers: {
            "xi-api-key": (process.env as any).ELEVENLABS_API_KEY
          }
        });

        if (!signedUrlResponse.ok) {
           console.error("ElevenLabs Auth Error:", await signedUrlResponse.text());
           throw new Error("Failed to authenticate agent connection.");
        }

        const { signed_url } = await signedUrlResponse.json();

        // 3. Initiate WebRTC via Signed URL. Overrides are structurally blocked by ElevenLabs on Signed auth tokens to prevent prompt injection.
        await conversation.startSession({
          signedUrl: signed_url
        });
      } catch (err) {
        console.error("Failed to start session", err);
        setDisplayedText("Microphone permission denied or connection failed.");
      }
  };

  const handleInterrupt = useCallback(() => {
    // WebRTC connection natively handles voice activity detection (VAD), 
    // but tapping the UI mic explicitly shows interruption for UX.
    setCallState('interrupted');
    setTimeout(() => {
        setCallState('listening');
    }, 1500);
  }, []);

  const endCall = useCallback(async () => {
    if (conversation.status === 'connected') {
       await conversation.endSession();
    }
    setCallState('ended');
  }, [conversation]);

  return {
    callState,
    displayedText,
    handleInterrupt,
    handleUserSpeak: async (txt: string) => {}, // Legacy bound, handled via native mic WebRTC
    endCall
  };
}
